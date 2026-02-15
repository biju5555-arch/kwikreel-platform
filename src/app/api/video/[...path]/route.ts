import { NextRequest, NextResponse } from 'next/server';

const VPS_API = process.env.VPS_API_INTERNAL || 'http://76.13.107.27:3001';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const videoPath = params.path.join('/');
    console.log('[Video Proxy] Fetching:', videoPath);

    const response = await fetch(`${VPS_API}/videos/${videoPath}`, {
      headers: {
        'Accept': 'video/mp4,video/*,*/*',
      },
    });

    if (!response.ok) {
      console.error('[Video Proxy] VPS returned:', response.status);
      return NextResponse.json(
        { error: 'Video not found' },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type') || 'video/mp4';
    const contentLength = response.headers.get('content-length');

    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    };

    if (contentLength) {
      headers['Content-Length'] = contentLength;
    }

    // Stream the video response
    const body = response.body;
    return new NextResponse(body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('[Video Proxy] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Proxy error' },
      { status: 500 }
    );
  }
}
