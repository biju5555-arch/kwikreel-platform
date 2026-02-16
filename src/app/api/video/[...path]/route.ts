import { NextRequest } from 'next/server';

// Use Node.js runtime (NOT edge) - edge can't fetch plain HTTP
// export const runtime = 'edge';

const VPS_API = process.env.VPS_API_INTERNAL || 'http://76.13.107.27:3001';

async function handleRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
  isHead: boolean = false
) {
  try {
    const { path } = await params;
    const videoPath = path.join('/');
    const vpsUrl = `${VPS_API}/videos/${videoPath}`;

    console.log('[Video Proxy]', isHead ? 'HEAD' : 'GET', vpsUrl);

    const headers: Record<string, string> = {};
    const rangeHeader = request.headers.get('range');
    if (rangeHeader) {
      headers['Range'] = rangeHeader;
    }

    const response = await fetch(vpsUrl, {
      method: isHead ? 'HEAD' : 'GET',
      headers,
    });

    if (!response.ok && response.status !== 206) {
      console.error('[Video Proxy] VPS returned', response.status, 'for', vpsUrl);
      return new Response(JSON.stringify({ error: 'Video not found' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const contentType = response.headers.get('content-type') || 'video/mp4';
    const contentLength = response.headers.get('content-length');
    const contentRange = response.headers.get('content-range');
    const acceptRanges = response.headers.get('accept-ranges');

    const responseHeaders: Record<string, string> = {
      'Content-Type': contentType,
      'Accept-Ranges': acceptRanges || 'bytes',
      'Content-Encoding': 'identity',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'CDN-Cache-Control': 'no-store',
      'Vercel-CDN-Cache-Control': 'no-store',
    };

    if (contentLength) {
      responseHeaders['Content-Length'] = contentLength;
    }
    if (contentRange) {
      responseHeaders['Content-Range'] = contentRange;
    }

    return new Response(isHead ? null : response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[Video Proxy] Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch video' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, context, false);
}

export async function HEAD(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, context, true);
}
