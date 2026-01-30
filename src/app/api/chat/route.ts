import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

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
            content: `You are a classifier. Determine if the user's message is related to school (studies, campus life, Northampton University, iKampus, etc.).
            If it IS school-related, output a JSON object: {"isSchoolRelated": true, "searchQuery": "optimal search keywords for Northampton Ask Us site"}.
            If it IS NOT school-related, output a JSON object: {"isSchoolRelated": false, "reason": "why it's not school related"}.
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

    const classificationData = await classificationResponse.json();
    const classification = JSON.parse(classificationData.choices[0]?.message?.content || '{}');

    if (!classification.isSchoolRelated) {
      return NextResponse.json({
        message: "I'm sorry, I am focused on school-related matters and iKampus. I cannot help with that specific question. If you have any questions about your studies or campus life, feel free to ask!"
      });
    }

    let searchContext = "";
    if (classification.searchQuery) {
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
            content: `You are Ally, an AI assistant for iKampus and Northampton University.
            You are calm enough to quiet the noise, structured enough to untangle it.
            You think deeply, joke lightly, and keep things real when thoughts get loud.
            Late nights suit you best — that's when you help things make sense 🌙.
            You ONLY answer school-related questions.
            If context from the Northampton 'Ask Us' site is provided, use it to give an accurate answer.
            Always include the relevant link if you found an answer on the 'Ask Us' site.
            If the question is school-related but you cannot find a specific answer in the context or your knowledge, suggest visiting https://askus.northampton.ac.uk/.
            Be helpful, friendly, and concise.`,
          },
          {
            role: 'user',
            content: `Context: ${searchContext || "No specific site context found."}\n\nQuestion: ${message}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
