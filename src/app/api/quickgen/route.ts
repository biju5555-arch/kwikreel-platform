import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const IDEOGRAM_API_KEY = process.env.IDEOGRAM_API_KEY;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const RUNWAY_API_KEY = process.env.RUNWAY_API_KEY;

interface BusinessInfo {
  name: string;
  tagline?: string;
  services: string[];
  location?: string;
  description: string;
  targetAudience?: string;
  adHook?: string;
}

interface GeneratedAd {
  script: {
    hook: string;
    problem: string;
    solution: string;
    cta: string;
    fullScript: string;
  };
  image?: {
    url: string;
    prompt: string;
  };
  voiceover?: {
    url: string;
    audioBase64?: string;
    duration: number;
  };
  video?: {
    url: string;
    status: string;
  };
}

// Generate AIDA script for contractor ads
async function generateScript(business: BusinessInfo): Promise<GeneratedAd['script']> {
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
          content: `You are an expert ad copywriter for contractor and trade businesses. Write compelling, conversational ad scripts using the AIDA framework. Keep it natural and relatable for homeowners.`
        },
        {
          role: 'user',
          content: `Write a 30-second video ad script for this contractor business:

Business: ${business.name}
Services: ${business.services.join(', ')}
Location: ${business.location || 'Local area'}
Target: ${business.targetAudience || 'Homeowners'}
${business.adHook ? `Hook idea: ${business.adHook}` : ''}

Return JSON with this structure:
{
  "hook": "Attention-grabbing opening line (2-3 seconds)",
  "problem": "Pain point the viewer relates to (5 seconds)", 
  "solution": "How this business solves it (10 seconds)",
  "cta": "Clear call to action (5 seconds)",
  "fullScript": "Complete script combining all parts naturally"
}

Make it sound like a real person talking, not corporate speak. Use contractions. Be specific to their trade.`
        }
      ],
      max_tokens: 800,
    }),
  });

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '{}';
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch?.[0] || '{}');
}

// Generate hero image with Ideogram
async function generateImage(business: BusinessInfo, script: GeneratedAd['script']): Promise<GeneratedAd['image']> {
  if (!IDEOGRAM_API_KEY) return undefined;

  const prompt = `Professional contractor advertisement photo: ${business.services[0]} service. 
Clean, modern, trustworthy. Shows skilled tradesperson at work or beautiful completed project.
High quality, well-lit, ${business.location || 'American'} home setting. 
Warm colors, professional but approachable. No text overlays.`;

  const response = await fetch('https://api.ideogram.ai/generate', {
    method: 'POST',
    headers: {
      'Api-Key': IDEOGRAM_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_request: {
        prompt,
        model: 'V_2',
        magic_prompt_option: 'AUTO',
        aspect_ratio: 'ASPECT_16_9',
        style_type: 'REALISTIC',
      },
    }),
  });

  if (!response.ok) return undefined;

  const data = await response.json();
  const imageUrl = data.data?.[0]?.url;
  
  return imageUrl ? { url: imageUrl, prompt } : undefined;
}

// Generate voiceover with ElevenLabs
async function generateVoiceover(script: GeneratedAd['script']): Promise<GeneratedAd['voiceover']> {
  if (!ELEVENLABS_API_KEY) return undefined;

  const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: script.fullScript,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  });

  if (!response.ok) return undefined;

  // Convert audio response to base64 for VPS consumption
  const audioBuffer = await response.arrayBuffer();
  const audioBase64 = Buffer.from(audioBuffer).toString('base64');

  return {
    url: 'base64',
    audioBase64,
    duration: Math.ceil(script.fullScript.split(' ').length / 2.5),
  };
}

// Start video generation with Runway (async - returns task ID)
async function startVideoGeneration(imageUrl: string, script: GeneratedAd['script']): Promise<GeneratedAd['video']> {
  if (!RUNWAY_API_KEY || !imageUrl) return undefined;

  const response = await fetch('https://api.dev.runwayml.com/v1/image_to_video', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RUNWAY_API_KEY}`,
      'Content-Type': 'application/json',
      'X-Runway-Version': '2024-11-06',
    },
    body: JSON.stringify({
      promptImage: imageUrl,
      promptText: `Gentle camera movement, professional contractor advertisement. ${script.hook}`,
      model: 'gen3a_turbo',
      duration: 5,
      ratio: '16:9',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Runway error:', error);
    return undefined;
  }

  const data = await response.json();
  return {
    url: '',
    status: data.id ? 'processing' : 'failed',
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { business, generateVideo = false } = body;

    if (!business || !business.name || !business.services?.length) {
      return NextResponse.json(
        { error: 'Business info with name and services is required' },
        { status: 400 }
      );
    }

    const result: GeneratedAd = {
      script: { hook: '', problem: '', solution: '', cta: '', fullScript: '' },
    };

    // Step 1: Generate script (required)
    console.log('Generating script...');
    result.script = await generateScript(business);

    // Step 2: Generate image (parallel-capable)
    console.log('Generating image...');
    result.image = await generateImage(business, result.script);

    // Step 3: Voiceover moved to VPS  just estimate duration, VPS generates audio from scriptText
    console.log('Voiceover will be generated on VPS from script text');
    result.voiceover = {
      url: 'vps-generated',
      duration: Math.ceil(result.script.fullScript.split(' ').length / 2.5),
    };

    // Step 4: Start video generation (optional, async)
    if (generateVideo && result.image?.url) {
      console.log('Starting video generation...');
      result.video = await startVideoGeneration(result.image.url, result.script);
    }

    return NextResponse.json({
      success: true,
      ad: result,
      business: business,
    });

  } catch (error) {
    console.error('Quick generate error:', error);
    return NextResponse.json(
      { error: 'Failed to generate ad', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    services: {
      script: OPENROUTER_API_KEY ? 'ready' : 'not configured',
      image: IDEOGRAM_API_KEY ? 'ready' : 'not configured',
      voiceover: ELEVENLABS_API_KEY ? 'ready' : 'not configured',
      video: RUNWAY_API_KEY ? 'ready' : 'not configured',
    },
  });
}
