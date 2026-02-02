import { NextRequest, NextResponse } from 'next/server';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, voiceId, modelId } = body;

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json({ error: 'ElevenLabs API key not configured' }, { status: 500 });
    }

    // Default voice ID (Rachel - narrative voice)
    const voice = voiceId || '21m00Tcm4TlvDq8ikWAM';
    const model = modelId || 'eleven_monolingual_v1';

    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voice, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text: text,
        model_id: model,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs error:', errorText);
      return NextResponse.json({ error: 'Voice generation failed', details: errorText }, { status: response.status });
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    return NextResponse.json({
      success: true,
      audio: base64Audio,
      contentType: 'audio/mpeg',
      message: 'Voiceover generated successfully',
    });
  } catch (error) {
    console.error('Voiceover generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate voiceover', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: ELEVENLABS_API_KEY ? 'connected' : 'disconnected',
    service: 'ElevenLabs',
  });
}
