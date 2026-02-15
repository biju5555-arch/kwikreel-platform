'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Sparkles, Globe, FileText, Image, Volume2, Video, 
  ChevronRight, Copy, Download, ArrowLeft, Check, Play,
  RefreshCw, Share2, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
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

type Step = 'input' | 'processing' | 'preview';

// Animated gradient text
function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
      {children}
    </span>
  );
}

// Progress step component
function ProcessingStep({ 
  label, 
  status, 
  index 
}: { 
  label: string; 
  status: 'pending' | 'active' | 'complete';
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={clsx(
        'flex items-center gap-4 p-4 rounded-2xl transition-all',
        status === 'active' && 'bg-orange-50 border border-orange-200',
        status === 'complete' && 'bg-green-50 border border-green-200',
        status === 'pending' && 'bg-gray-50 border border-gray-100'
      )}
    >
      <div className={clsx(
        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all',
        status === 'complete' && 'bg-green-500 text-white',
        status === 'active' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white',
        status === 'pending' && 'bg-gray-200 text-gray-500'
      )}>
        {status === 'complete' ? (
          <Check size={16} />
        ) : status === 'active' ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          index + 1
        )}
      </div>
      <span className={clsx(
        'font-medium',
        status === 'complete' && 'text-green-700',
        status === 'active' && 'text-orange-700',
        status === 'pending' && 'text-gray-400'
      )}>
        {label}
      </span>
    </motion.div>
  );
}

function QuickGenContent() {
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get('url') || '';
  
  const [step, setStep] = useState<Step>('input');
  const [url, setUrl] = useState(initialUrl);
  const [manualMode, setManualMode] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [business, setBusiness] = useState<BusinessInfo | null>(null);
  const [ad, setAd] = useState<GeneratedAd | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [videoGenerating, setVideoGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  const processingSteps = [
    'Analyzing your website',
    'Extracting brand identity',
    'Writing persuasive script',
    'Generating visuals',
    'Creating voiceover',
    'Finalizing your ad'
  ];

  // Auto-start if URL provided
  useEffect(() => {
    if (initialUrl && step === 'input') {
      handleGenerate();
    }
  }, []);

  const handleGenerate = async () => {
    const inputUrl = url.trim();
    if (!inputUrl && !manualInput.trim()) return;
    
    setError(null);
    setStep('processing');
    setCurrentStep(0);

    try {
      // Simulate scraping
      setCurrentStep(0);
      await simulateStep(800);
      
      setCurrentStep(1);
      await simulateStep(600);

      // Call the actual API
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl || manualInput }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to analyze');
      }

      const { business: businessData } = await response.json();
      setBusiness(businessData);
      
      setCurrentStep(2);
      await simulateStep(1000);
      
      setCurrentStep(3);
      await simulateStep(1200);
      
      setCurrentStep(4);
      await simulateStep(1000);

      // Generate the ad
      const genResponse = await fetch('/api/quickgen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business: businessData, generateVideo: false }),
      });

      if (!genResponse.ok) {
        const data = await genResponse.json();
        throw new Error(data.error || 'Failed to generate');
      }

      const { ad: adData } = await genResponse.json();
      
      setCurrentStep(5);
      await simulateStep(500);
      
      setAd(adData);
      setStep('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStep('input');
    }
  };

  const simulateStep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const handleReset = () => {
    setStep('input');
    setUrl('');
    setManualInput('');
    setBusiness(null);
    setAd(null);
    setError(null);
    setCurrentStep(0);
    setVideoGenerating(false);
    setVideoUrl(null);
    setVideoError(null);
  };

  const handleGenerateVideo = async () => {
    if (!ad || !business) return;
    setVideoGenerating(true);
    setVideoError(null);
    try {
      const response = await fetch('/api/assemble', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: ad.script.fullScript,
          imageUrl: ad.image?.url,
          voiceoverUrl: ad.voiceover?.url,
          businessName: business.name,
          services: business.services,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Video assembly failed');
      }
      setVideoUrl(data.videoUrl);
    } catch (err) {
      setVideoError(err instanceof Error ? err.message : 'Failed to generate video');
    } finally {
      setVideoGenerating(false);
    }
  };

  const copyScript = async () => {
    if (ad?.script.fullScript) {
      await navigator.clipboard.writeText(ad.script.fullScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </Link>
          <span className="text-xl font-bold tracking-tight">
            <GradientText>KwikReel</GradientText>
          </span>
        </div>

              {/* Video Error Display */}
              {videoError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
                  {videoError}
                </div>
              )}

              {/* Video Player */}
              {videoUrl && (
                <div className="rounded-2xl overflow-hidden border border-gray-200 bg-black">
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    className="w-full"
                  />
                  <div className="p-3 bg-gray-50 flex justify-end">
                    <a
                      href={videoUrl}
                      download
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl text-sm font-medium hover:from-orange-600 hover:to-red-700 transition-all"
                    >
                      <Download size={16} />
                      Download Video
                    </a>
                  </div>
                </div>
              )}
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {/* INPUT STEP */}
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-xl mx-auto"
            >
              {/* Header */}
              <div className="text-center mb-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-white mb-6 shadow-lg shadow-orange-500/25"
                >
                  <Sparkles size={28} />
                </motion.div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Create Your Video Ad</h1>
                <p className="text-gray-600">Enter your website URL and we'll do the rest.</p>
              </div>

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm mb-6"
                >
                  {error}
                </motion.div>
              )}

              {/* URL Input */}
              {!manualMode ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://your-business.com"
                      className="w-full bg-white border-2 border-gray-200 rounded-2xl pl-14 pr-6 py-5 text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                      onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    />
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={!url.trim()}
                    className="w-full py-5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-gray-300 disabled:to-gray-300 rounded-2xl font-semibold text-lg text-white transition-all shadow-lg shadow-orange-500/25 disabled:shadow-none flex items-center justify-center gap-3"
                  >
                    <Sparkles size={22} />
                    Generate Video Ad
                  </button>

                  <button
                    onClick={() => setManualMode(true)}
                    className="w-full py-3 text-gray-500 hover:text-gray-700 transition-colors text-sm"
                  >
                    No website? Describe your business instead →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <textarea
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Describe your business: name, services, location, what makes you different..."
                    rows={5}
                    className="w-full bg-white border-2 border-gray-200 rounded-2xl px-6 py-5 text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                  />

                  <button
                    onClick={handleGenerate}
                    disabled={!manualInput.trim()}
                    className="w-full py-5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-gray-300 disabled:to-gray-300 rounded-2xl font-semibold text-lg text-white transition-all shadow-lg shadow-orange-500/25 disabled:shadow-none flex items-center justify-center gap-3"
                  >
                    <Sparkles size={22} />
                    Generate Video Ad
                  </button>

                  <button
                    onClick={() => setManualMode(false)}
                    className="w-full py-3 text-gray-500 hover:text-gray-700 transition-colors text-sm"
                  >
                    ← Back to URL input
                  </button>
                </div>
              )}

              {/* What you'll get */}
              <div className="mt-12 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-sm font-medium text-gray-500 mb-5">What you'll get:</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: FileText, label: 'AIDA Script' },
                    { icon: Image, label: 'Hero Image' },
                    { icon: Volume2, label: 'Voiceover' },
                    { icon: Video, label: 'Video Ad' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Icon size={20} className="text-orange-500" />
                      <span className="text-gray-700 font-medium">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* PROCESSING STEP */}
          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-lg mx-auto"
            >
              <div className="text-center mb-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 text-white mb-6 shadow-lg shadow-orange-500/25"
                >
                  <Sparkles size={36} />
                </motion.div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Creating Your Ad</h1>
                <p className="text-gray-600">This usually takes about 30-60 seconds</p>
              </div>

              {/* Progress steps */}
              <div className="space-y-3">
                {processingSteps.map((label, i) => (
                  <ProcessingStep
                    key={label}
                    label={label}
                    status={i < currentStep ? 'complete' : i === currentStep ? 'active' : 'pending'}
                    index={i}
                  />
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-8">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-500 to-red-600"
                    initial={{ width: '0%' }}
                    animate={{ width: `${((currentStep + 1) / processingSteps.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* PREVIEW STEP */}
          {step === 'preview' && ad && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Success header */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500 text-white mb-6 shadow-lg shadow-green-500/25"
                >
                  <CheckCircle2 size={32} />
                </motion.div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Your Ad is Ready!</h1>
                {business && (
                  <p className="text-gray-600">{business.name} • {business.services.slice(0, 2).join(', ')}</p>
                )}
              </div>

              {/* Script Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                      <FileText size={20} className="text-orange-600" />
                    </div>
                    <span className="font-semibold text-gray-900">Ad Script</span>
                  </div>
                  <button
                    onClick={copyScript}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center gap-2 text-sm font-medium text-gray-700"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  {[
                    { label: 'Hook', text: ad.script.hook, color: 'orange' },
                    { label: 'Problem', text: ad.script.problem, color: 'gray' },
                    { label: 'Solution', text: ad.script.solution, color: 'gray' },
                    { label: 'Call to Action', text: ad.script.cta, color: 'green' },
                  ].map(({ label, text, color }) => (
                    <div key={label}>
                      <p className={clsx(
                        'text-xs uppercase tracking-wider font-semibold mb-2',
                        color === 'orange' && 'text-orange-500',
                        color === 'green' && 'text-green-500',
                        color === 'gray' && 'text-gray-400'
                      )}>
                        {label}
                      </p>
                      <p className={clsx(
                        'text-lg leading-relaxed',
                        (color === 'orange' || color === 'green') ? 'text-gray-900 font-medium' : 'text-gray-700'
                      )}>
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Image Card */}
              {ad.image && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                        <Image size={20} className="text-purple-600" />
                      </div>
                      <span className="font-semibold text-gray-900">Hero Image</span>
                    </div>
                    <a
                      href={ad.image.url}
                      download
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center gap-2 text-sm font-medium text-gray-700"
                    >
                      <Download size={16} />
                      Download
                    </a>
                  </div>
                  <div className="aspect-video relative bg-gray-100">
                    <img
                      src={ad.image.url}
                      alt="Generated ad image"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-4"
              >
                <button
                  onClick={handleReset}
                  className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 rounded-2xl font-semibold text-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw size={20} />
                  Start Over
                </button>
                <button
                  onClick={handleGenerateVideo}
                  disabled={videoGenerating}
                  className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-400 rounded-2xl font-semibold text-white transition-all shadow-lg shadow-orange-500/25 disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {videoGenerating ? (
                    <><Loader2 size={20} className="animate-spin" /> Generating Video...</>
                  ) : videoUrl ? (
                    <><CheckCircle2 size={20} /> Video Ready!</>
                  ) : (
                    <><Video size={20} /> Generate Full Video <ChevronRight size={18} /></>
                  )}
                </button>
              </motion.div>

              {/* Share options */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <button className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
                  <Share2 size={18} />
                  Share your ad
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function QuickGenPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-orange-500" />
      </div>
    }>
      <QuickGenContent />
    </Suspense>
  );
}
