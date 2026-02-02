import { NextRequest, NextResponse } from 'next/server';

const RUNWAY_API_KEY = process.env.RUNWAY_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, imageUrl, duration } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!RUNWAY_API_KEY) {
      return NextResponse.json({ error: 'Runway API key not configured' }, { status: 500 });
    }

    const requestBody: any = {
      promptText: prompt,
      model: 'gen3a_turbo',
      duration: duration || 5,
      watermark: false,
    };

    if (imageUrl) {
      requestBody.promptImage = imageUrl;
    }

    const response = await fetch('https://api.dev.runwayml.com/v1/image_to_video', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + RUNWAY_API_KEY,
        'Content-Type': 'application/json',
        'X-Runway-Version': '2024-11-06',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Runway error:', errorText);
      return NextResponse.json({ error: 'Video generation failed', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      taskId: data.id,
      status: data.status,
      message: 'Video generation started',
    });
  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate video', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const taskId = request.nextUrl.searchParams.get('taskId');
  
  if (taskId && RUNWAY_API_KEY) {
    const response = await fetch('https://api.dev.runwayml.com/v1/tasks/' + taskId, {
      headers: {
        'Authorization': 'Bearer ' + RUNWAY_API_KEY,
        'X-Runway-Version': '2024-11-06',
      },
    });
    const data = await response.json();
    return NextResponse.json(data);
  }

  return NextResponse.json({
    status: RUNWAY_API_KEY ? 'connected' : 'disconnected',
    service: 'Runway',
  });
}
