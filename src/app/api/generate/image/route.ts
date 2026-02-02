import { NextRequest, NextResponse } from 'next/server';

const IDEOGRAM_API_KEY = process.env.IDEOGRAM_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, style, aspectRatio } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!IDEOGRAM_API_KEY) {
      return NextResponse.json({ error: 'Ideogram API key not configured' }, { status: 500 });
    }

    const response = await fetch('https://api.ideogram.ai/generate', {
      method: 'POST',
      headers: {
        'Api-Key': IDEOGRAM_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_request: {
          prompt: prompt,
          model: 'V_2',
          magic_prompt_option: 'AUTO',
          aspect_ratio: aspectRatio || 'ASPECT_16_9',
          style_type: style || 'REALISTIC',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ideogram error:', errorText);
      return NextResponse.json({ error: 'Image generation failed', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      images: data.data,
      message: 'Image generated successfully',
    });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: IDEOGRAM_API_KEY ? 'connected' : 'disconnected',
    service: 'Ideogram',
  });
}
