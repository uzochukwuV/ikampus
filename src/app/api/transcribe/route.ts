import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_TRANSCRIPTIONS_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';

export async function POST(request: NextRequest) {
    try {
        if (!GROQ_API_KEY) {
            console.error('GROQ_API_KEY not found in environment variables');
            return NextResponse.json(
                { error: 'API key not configured' },
                { status: 500 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file') as Blob;

        if (!file) {
            return NextResponse.json(
                { error: 'No audio file provided' },
                { status: 400 }
            );
        }

        // Groq requires a file object with a name for the API to recognize the type properly
        // We can just construct a purely backend formdata to forward
        const groqFormData = new FormData();
        groqFormData.append('file', file, 'recording.webm'); // Defaulting to .webm as that's what we'll likely send
        groqFormData.append('model', 'whisper-large-v3');
        groqFormData.append('response_format', 'json');

        const response = await fetch(GROQ_TRANSCRIPTIONS_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
            },
            body: groqFormData,
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Groq API Error:', errorData);
            return NextResponse.json(
                { error: `Groq API Error: ${response.statusText}`, details: errorData },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json({ text: data.text });

    } catch (error) {
        console.error('Transcription Error:', error);
        return NextResponse.json(
            { error: 'Internal server error processing transcription' },
            { status: 500 }
        );
    }
}
