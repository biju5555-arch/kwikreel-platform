'use client';

import { useState } from 'react';
import { Loader2, Sparkles, Globe, FileText, Image, Volume2, Video, ChevronRight, Copy, Download } from 'lucide-react';
import { clsx } from 'clsx';

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
    duration: number;
  };
  video?: {
    url: string;
    status: string;
  };
}

type Step = 'input' | 'scraping' | 'generating' | 'preview';

export function QuickGenPanel() {
  const [step, setStep] = useState<Step>('input');
  const [url, setUrl] = useState('');
  const [manualMode, setManualMode] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [business, setBusiness] = useState<BusinessInfo | null>(null);
  const [ad, setAd] = useState<GeneratedAd | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentAction, setCurrentAction] = useState('');

  const handleScrape = async () => {
    if (!url.trim()) return;
    
    setError(null);
    setStep('scraping');
    setCurrentAction('Analyzing website...');

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze website');
      }

      setBusiness(data.business);
      await handleGenerate(data.business);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze website');
      setStep('input');
    }
  };

  const handleManualSubmit = async () => {
    if (!manualInput.trim()) return;

    setError(null);
    setStep('scraping');
    setCurrentAction('Analyzing your input...');

    // Parse manual input into business info
    const business: BusinessInfo = {
      name: 'Your Business',
      services: [manualInput.split(' ').slice(0, 3).join(' ')],
      description: manualInput,
      targetAudience: 'Homeowners',
    };

    setBusiness(business);
    await handleGenerate(business);
  };

  const handleGenerate = async (businessInfo: BusinessInfo) => {
    setStep('generating');
    
    try {
      // Step 1: Script
      setCurrentAction('Writing ad script...');
      await new Promise(r => setTimeout(r, 500)); // Visual feedback

      // Step 2: Image  
      setCurrentAction('Creating hero image...');
      
      // Step 3: Voiceover
      setCurrentAction('Generating voiceover...');

      const response = await fetch('/api/quickgen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business: businessInfo, generateVideo: false }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate ad');
      }

      setAd(data.ad);
      setStep('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate ad');
      setStep('input');
    }
  };

  const handleReset = () => {
    setStep('input');
    setUrl('');
    setManualInput('');
    setBusiness(null);
    setAd(null);
    setError(null);
  };

  const copyScript = () => {
    if (ad?.script.fullScript) {
      navigator.clipboard.writeText(ad.script.fullScript);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-zinc-900 to-zinc-950">
      {/* Header */}
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔱</span>
          <div>
            <h1 className="text-xl font-bold text-white">Quick Generate</h1>
            <p className="text-sm text-zinc-500">URL → Ad in 60 seconds</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Step: Input */}
        {step === 'input' && (
          <div className="max-w-xl mx-auto space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            {!manualMode ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">
                    Contractor Website URL
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example-contractor.com"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>

                <button
                  onClick={handleScrape}
                  disabled={!url.trim()}
                  className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:from-zinc-700 disabled:to-zinc-700 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 disabled:shadow-none"
                >
                  <Sparkles size={20} />
                  Generate Ad from Website
                </button>

                <div className="text-center">
                  <button
                    onClick={() => setManualMode(true)}
                    className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    No website? Describe your business instead →
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">
                    Describe the Business
                  </label>
                  <textarea
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Example: Johnson Roofing in Minneapolis. We do residential roof repairs and replacements. 20 years experience. Family owned."
                    rows={4}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                  />
                </div>

                <button
                  onClick={handleManualSubmit}
                  disabled={!manualInput.trim()}
                  className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:from-zinc-700 disabled:to-zinc-700 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 disabled:shadow-none"
                >
                  <Sparkles size={20} />
                  Generate Ad
                </button>

                <div className="text-center">
                  <button
                    onClick={() => setManualMode(false)}
                    className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    ← Back to URL input
                  </button>
                </div>
              </>
            )}

            {/* What you'll get */}
            <div className="mt-8 p-4 bg-zinc-800/50 rounded-xl">
              <p className="text-sm font-medium text-zinc-400 mb-3">What you'll get:</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <FileText size={16} className="text-orange-500" />
                  <span>AIDA Script</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <Image size={16} className="text-orange-500" />
                  <span>Hero Image</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <Volume2 size={16} className="text-orange-500" />
                  <span>Voiceover</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <Video size={16} className="text-orange-500" />
                  <span>Video (optional)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step: Processing */}
        {(step === 'scraping' || step === 'generating') && (
          <div className="max-w-xl mx-auto flex flex-col items-center justify-center py-16 space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-center">
                <Loader2 size={40} className="text-white animate-spin" />
              </div>
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-orange-600 to-red-600 opacity-20 animate-pulse" />
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-lg font-medium text-white">{currentAction}</p>
              <p className="text-sm text-zinc-500">This usually takes 30-60 seconds</p>
            </div>

            {/* Progress steps */}
            <div className="w-full max-w-xs space-y-2 mt-8">
              <ProgressStep 
                label="Analyze website" 
                status={step === 'scraping' ? 'active' : 'complete'} 
              />
              <ProgressStep 
                label="Write ad script" 
                status={step === 'generating' ? 'active' : step === 'scraping' ? 'pending' : 'complete'} 
              />
              <ProgressStep 
                label="Generate image" 
                status={step === 'generating' && currentAction.includes('image') ? 'active' : step === 'scraping' ? 'pending' : 'pending'} 
              />
              <ProgressStep 
                label="Create voiceover" 
                status="pending" 
              />
            </div>
          </div>
        )}

        {/* Step: Preview */}
        {step === 'preview' && ad && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Business Info */}
            {business && (
              <div className="p-4 bg-zinc-800/50 rounded-xl">
                <p className="text-lg font-semibold text-white">{business.name}</p>
                <p className="text-sm text-zinc-400">{business.services.join(' • ')}</p>
              </div>
            )}

            {/* Script */}
            <div className="bg-zinc-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-zinc-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-orange-500" />
                  <span className="font-medium text-white">Ad Script</span>
                </div>
                <button
                  onClick={copyScript}
                  className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  <Copy size={16} className="text-zinc-400" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-orange-500 mb-1">Hook</p>
                  <p className="text-white">{ad.script.hook}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-orange-500 mb-1">Problem</p>
                  <p className="text-zinc-300">{ad.script.problem}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-orange-500 mb-1">Solution</p>
                  <p className="text-zinc-300">{ad.script.solution}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-orange-500 mb-1">Call to Action</p>
                  <p className="text-white font-medium">{ad.script.cta}</p>
                </div>
              </div>
            </div>

            {/* Image */}
            {ad.image && (
              <div className="bg-zinc-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-zinc-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image size={18} className="text-orange-500" />
                    <span className="font-medium text-white">Hero Image</span>
                  </div>
                  <a
                    href={ad.image.url}
                    download
                    className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    <Download size={16} className="text-zinc-400" />
                  </a>
                </div>
                <div className="aspect-video relative">
                  <img
                    src={ad.image.url}
                    alt="Generated ad image"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-medium text-white transition-colors"
              >
                Start Over
              </button>
              <button
                className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-xl font-medium text-white transition-all flex items-center justify-center gap-2"
              >
                Generate Video
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressStep({ label, status }: { label: string; status: 'pending' | 'active' | 'complete' }) {
  return (
    <div className="flex items-center gap-3">
      <div className={clsx(
        'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
        status === 'complete' && 'bg-green-500 text-white',
        status === 'active' && 'bg-orange-500 text-white animate-pulse',
        status === 'pending' && 'bg-zinc-700 text-zinc-500'
      )}>
        {status === 'complete' ? '✓' : status === 'active' ? <Loader2 size={12} className="animate-spin" /> : '○'}
      </div>
      <span className={clsx(
        'text-sm',
        status === 'complete' && 'text-green-400',
        status === 'active' && 'text-white',
        status === 'pending' && 'text-zinc-500'
      )}>
        {label}
      </span>
    </div>
  );
}

export default QuickGenPanel;
