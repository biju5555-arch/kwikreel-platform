import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const BHAIRAV_SYSTEM_PROMPT = "You are Bhairav, an AI Film Director assistant. You help users create video content, including: Generating images with Ideogram, Creating videos with Runway, Generating voiceovers with ElevenLabs, and Managing creative workflows. Be helpful, creative, and guide users through the content creation process. When users want to create images, videos, or voiceovers, explain how you can help them.";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + OPENROUTER_API_KEY,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://bhairav-platform.vercel.app',
        'X-Title': 'Bhairav AI Film Director'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-sonnet-4',
        messages: [
          { role: 'system', content: BHAIRAV_SYSTEM_PROMPT },
          { role: 'user', content: message }
        ],
        max_tokens: 1024
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter error:', errorText);
      return NextResponse.json(
        { error: 'AI service error', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || 'No response';

    return NextResponse.json({
      success: true,
      message: assistantMessage,
      sessionId: sessionId || 'bhairav-session'
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: OPENROUTER_API_KEY ? 'connected' : 'disconnected',
    service: 'OpenRouter'
  });
}
