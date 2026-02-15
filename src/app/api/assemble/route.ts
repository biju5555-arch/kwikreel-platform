import { NextRequest, NextResponse } from 'next/server';

const VPS_API = process.env.VPS_API_INTERNAL || 'http://76.13.107.27:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('[Assemble Proxy] Forwarding request to VPS...');

    const response = await fetch(`${VPS_API}/assemble`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Assemble Proxy] VPS error:', data);
      return NextResponse.json(data, { status: response.status });
    }

    // Rewrite video URL to use our proxy
    if (data.success && data.videoUrl) {
      const urlPath = data.videoUrl.replace(/^https?:\/\/[^\/]+\/videos\//, '');
      data.videoUrl = `/api/video/${urlPath}`;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Assemble Proxy] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Proxy error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const response = await fetch(`${VPS_API}/health`);
    const data = await response.json();
    return NextResponse.json({ vps: data });
  } catch {
    return NextResponse.json({ vps: 'unreachable' });
  }
}
