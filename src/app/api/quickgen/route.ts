import { NextRequest, NextResponse } from 'next/server';
import { saveAsset, slugify } from '@/lib/storage';

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
    localPath?: string;
  };
  voiceover?: {
    url: string;
    localPath?: string;
    base64?: string;
    duration: number;
  };
  video?: {
    url: string;
    localPath?: string;
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
async function generateImage(business: BusinessInfo, script: GeneratedAd['script'], businessSlug: string): Promise<GeneratedAd['image']> {
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
  
  if (!imageUrl) return undefined;

  // Download and save image locally (if storage enabled)
  try {
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const saved = await saveAsset(businessSlug, 'images', 'hero.png', Buffer.from(imageBuffer));
    return { url: imageUrl, prompt, localPath: saved?.localPath };
  } catch {
    return { url: imageUrl, prompt };
  }
}

// Generate voiceover with ElevenLabs
async function generateVoiceover(script: GeneratedAd['script'], businessSlug: string): Promise<GeneratedAd['voiceover']> {
  if (!ELEVENLABS_API_KEY) return undefined;

  // Voice options:
  // pNInz6obpgDQGcFmaJgB = Adam (deep male, confident)
  // ErXwobaYiN019PkySvjV = Antoni (warm male, friendly)
  // VR6AewLTigWG4xSOukaG = Arnold (energetic male)
  // yoZ06aMxZJJ28mfd3POQ = Sam (professional male)
  const VOICE_ID = 'ErXwobaYiN019PkySvjV'; // Antoni - warm, friendly, good for local business ads
  
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: script.fullScript,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.4,
        similarity_boost: 0.8,
        style: 0.3,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) return undefined;

  // Save audio to local storage (if storage enabled)
  const audioBuffer = await response.arrayBuffer();
  const saved = await saveAsset(businessSlug, 'voiceovers', 'voiceover.mp3', Buffer.from(audioBuffer));
  
  // Convert to base64 for API response
  const base64Audio = Buffer.from(audioBuffer).toString('base64');
  
  return {
    url: saved?.publicPath || `data:audio/mpeg;base64,${base64Audio.slice(0, 100)}...`,
    localPath: saved?.localPath,
    base64: base64Audio,
    duration: Math.ceil(script.fullScript.split(' ').length / 2.5), // rough estimate
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

    const businessSlug = slugify(business.name);
    
    const result: GeneratedAd = {
      script: { hook: '', problem: '', solution: '', cta: '', fullScript: '' },
    };

    // Step 1: Generate script (required)
    console.log('Generating script...');
    result.script = await generateScript(business);

    // Step 2: Generate image (parallel-capable)
    console.log('Generating image...');
    result.image = await generateImage(business, result.script, businessSlug);

    // Step 3: Generate voiceover (parallel-capable)
    console.log('Generating voiceover...');
    result.voiceover = await generateVoiceover(result.script, businessSlug);

    // Step 4: Start video generation (optional, async)
    if (generateVideo && result.image?.url) {
      console.log('Starting video generation...');
      result.video = await startVideoGeneration(result.image.url, result.script);
    }

    return NextResponse.json({
      success: true,
      ad: result,
      business: business,
      storage: { businessSlug },
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
