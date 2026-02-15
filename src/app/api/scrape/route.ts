import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

interface BusinessInfo {
  name: string;
  tagline: string;
  services: string[];
  location: string;
  phone: string;
  description: string;
  images: string[];
  targetAudience: string;
}

const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

async function fetchWithRetry(url: string): Promise<Response> {
  let response = await fetch(url, {
    headers: {
      'User-Agent': BROWSER_UA,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    },
    redirect: 'follow',
  });

  if (response.ok) return response;

  const urlObj = new URL(url);
  if (urlObj.hostname.startsWith('www.')) {
    urlObj.hostname = urlObj.hostname.replace('www.', '');
  } else {
    urlObj.hostname = 'www.' + urlObj.hostname;
  }

  console.log('[Scrape] Retrying with alternate URL:', urlObj.toString());
  response = await fetch(urlObj.toString(), {
    headers: {
      'User-Agent': BROWSER_UA,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    },
    redirect: 'follow',
  });

  return response;
}

async function extractTextFromUrl(url: string): Promise<string> {
  try {
    const response = await fetchWithRetry(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }

    const html = await response.text();

    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 8000);

    const imgRegex = /<img[^>]+src="([^"]+)"/gi;
    const images: string[] = [];
    let match;
    while ((match = imgRegex.exec(html)) !== null && images.length < 5) {
      const imgUrl = match[1];
      if (imgUrl.startsWith('http') && !imgUrl.includes('icon') && !imgUrl.includes('logo')) {
        images.push(imgUrl);
      }
    }

    return JSON.stringify({ text, images });
  } catch (error) {
    console.error('URL fetch error:', error);
    throw error;
  }
}

async function analyzeWithAI(content: string, url: string): Promise<BusinessInfo> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-sonnet-4',
      messages: [
        {
          role: 'system',
          content: 'You are a business analyst. Extract structured information from contractor/trade business websites. Return ONLY valid JSON, no other text.'
        },
        {
          role: 'user',
          content: `Analyze this contractor website content and extract business information.

URL: ${url}

Content: ${content}

Return JSON with this exact structure:
{
  "name": "Business name",
  "tagline": "Short catchy tagline or slogan (create one if not found)",
  "services": ["service1", "service2", "service3"],
  "location": "City, State or service area",
  "phone": "Phone number if found",
  "description": "2-3 sentence business description",
  "targetAudience": "Who they serve (homeowners, commercial, etc.)",
  "adHook": "A compelling hook for an ad (pain point + solution)"
}`
        }
      ],
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    throw new Error('AI analysis failed');
  }

  const data = await response.json();
  const content_text = data.choices?.[0]?.message?.content || '{}';

  const jsonMatch = content_text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse AI response');
  }

  return JSON.parse(jsonMatch[0]);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({ error: 'OpenRouter API key not configured' }, { status: 500 });
    }

    const content = await extractTextFromUrl(url);
    const businessInfo = await analyzeWithAI(content, url);

    const { images } = JSON.parse(content);
    businessInfo.images = images || [];

    return NextResponse.json({
      success: true,
      business: businessInfo,
      sourceUrl: url,
    });
  } catch (error) {
    console.error('Scrape error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze URL', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: OPENROUTER_API_KEY ? 'ready' : 'not configured',
    service: 'URL Scraper',
  });
}

