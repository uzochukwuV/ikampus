import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Format conversation history for context
    const conversationContext = history?.length > 0
      ? history.map((m: { role: string; content: string }) =>
          `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
        ).join('\n')
      : '';

    if (!GROQ_API_KEY) {
      console.error('GROQ_API_KEY not found in environment variables');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Phase 1: Determine if the message is school-related and generate a search query if needed
    const classificationResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a classifier. Determine if the user's message is related to education or learning.

ACCEPT these topics (isEducationRelated: true):
- Academic subjects (math, science, history, literature, programming, languages, etc.)
- Study help, homework, assignments, essays, research
- Learning concepts, explanations of topics, tutorials
- University/college life, campus questions, student services
- Career guidance, skills development, professional growth
- Northampton University or iKampus specific questions
- General knowledge questions that could help someone learn
- Exam preparation, study techniques, time management for students

REJECT these topics (isEducationRelated: false):
- Harmful, illegal, or dangerous content
- Adult/explicit content
- Personal relationship advice unrelated to academics
- Entertainment recommendations (movies, games, music)
- Political debates or controversial opinions
- Medical/legal advice (suggest consulting professionals)

If it IS education/learning related, output: {"isEducationRelated": true, "needsUniSearch": true/false, "searchQuery": "keywords if Northampton-specific"}
Set needsUniSearch to true ONLY if the question is specifically about Northampton University policies, services, or campus.

If it IS NOT education related, output: {"isEducationRelated": false, "reason": "brief reason"}
Only output the JSON object.`,
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0,
        response_format: { type: "json_object" }
      }),
    });

    if (!classificationResponse.ok) {
      console.error('Classification API error:', classificationResponse.status);
      throw new Error('Failed to classify message');
    }

    const classificationData = await classificationResponse.json();

    let classification = { isEducationRelated: true, needsUniSearch: false, searchQuery: '' };
    try {
      const content = classificationData.choices?.[0]?.message?.content;
      if (content) {
        classification = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse classification response:', parseError);
      // Default to treating as education-related to be helpful
    }

    if (!classification.isEducationRelated) {
      return NextResponse.json({
        message: "I'm here to help with learning, studying, and education-related questions. While I can't help with that specific topic, I'd love to assist you with your studies, explain concepts, help with assignments, or answer questions about university life. What would you like to learn about?"
      });
    }

    let searchContext = "";
    if (classification.needsUniSearch && classification.searchQuery) {
      try {
        const searchUrl = `https://askus.northampton.ac.uk/search/?q=${encodeURIComponent(classification.searchQuery)}`;
        const searchResponse = await fetch(searchUrl);
        const html = await searchResponse.text();

        // Basic parsing to extract FAQ titles and links (or snippets)
        // Since we don't have a full HTML parser like Cheerio, we'll use regex for a quick extraction
        // The site uses <a> tags for result links. We'll grab the first few.
        const matches = html.matchAll(/<a[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/g);
        let count = 0;
        for (const match of matches) {
          const href = match[1];
          const text = match[2].replace(/<[^>]*>/g, '').trim(); // Remove nested tags
          if (href.includes('/faq/') && text.length > 5) {
            searchContext += `FAQ: ${text} (Link: https://askus.northampton.ac.uk${href})\n`;
            count++;
          }
          if (count >= 5) break;
        }
      } catch (e) {
        console.error("Search error:", e);
      }
    }

    // Phase 2: Final response with context
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are Ally, an AI learning companion on iKampus.

Your personality:
- Calm and patient — you make complex things simple
- Encouraging — you believe everyone can learn
- Thoughtful — you give well-structured, clear explanations
- Friendly — approachable but professional

What you help with:
- Explaining academic concepts across all subjects
- Study tips, learning strategies, and time management
- Homework help and assignment guidance (guide, don't just give answers)
- Essay writing, research methods, and critical thinking
- Exam preparation and revision techniques
- Career guidance and skill development
- Northampton University specific questions (use provided context when available)

Guidelines:
- Break down complex topics into digestible parts
- Use examples and analogies to clarify concepts
- Encourage deeper thinking with follow-up questions when appropriate
- If Northampton 'Ask Us' context is provided, use it and include the relevant link
- For Northampton-specific questions without context, suggest visiting https://askus.northampton.ac.uk/
- Keep responses focused and helpful — not too long unless detail is needed
- Use markdown formatting for better readability when explaining steps or lists`,
          },
          {
            role: 'user',
            content: `${conversationContext ? `Previous conversation:\n${conversationContext}\n\n` : ''}${searchContext ? `Northampton University context:\n${searchContext}\n\n` : ''}Question: ${message}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      console.error('Final response API error:', response.status);
      throw new Error('Failed to generate response');
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response. Please try again.';

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
