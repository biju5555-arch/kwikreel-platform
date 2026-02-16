import { NextRequest, NextResponse } from 'next/server';

const VPS_API = process.env.VPS_API_INTERNAL || 'http://76.13.107.27:3001';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const videoPath = path.join('/');
    const vpsUrl = `${VPS_API}/videos/${videoPath}`;

    console.log('[Video Proxy] Fetching:', vpsUrl);

    const headers: Record<string, string> = {};
    const rangeHeader = request.headers.get('range');
    if (rangeHeader) {
      headers['Range'] = rangeHeader;
    }

    const response = await fetch(vpsUrl, { headers });

    if (!response.ok && response.status !== 206) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type') || 'video/mp4';
    const contentLength = response.headers.get('content-length');
    const contentRange = response.headers.get('content-range');
    const acceptRanges = response.headers.get('accept-ranges');

    const responseHeaders: Record<string, string> = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000',
      'Accept-Ranges': acceptRanges || 'bytes',
    };

    if (contentLength) {
      responseHeaders['Content-Length'] = contentLength;
    }
    if (contentRange) {
      responseHeaders['Content-Range'] = contentRange;
    }

    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[Video Proxy] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video' },
      { status: 500 }
    );
  }
}
