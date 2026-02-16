'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Globe, Clock, CheckCircle2, ChevronRight, Film, Video, Mic, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

// Animated gradient text component
function GradientText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
}

// Parallax floating element
function FloatingElement({ 
  children, 
  className = '',
  speed = 1,
  rotateSpeed = 0,
  delay = 0
}: { 
  children: React.ReactNode; 
  className?: string;
  speed?: number;
  rotateSpeed?: number;
  delay?: number;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -200 * speed]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360 * rotateSpeed]);
  
  return (
    <motion.div
      ref={ref}
      style={{ y, rotate }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.8, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Mouse parallax wrapper
function MouseParallax({ children, strength = 20 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set((e.clientX - centerX) / strength);
        mouseY.set((e.clientY - centerY) / strength);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, strength]);

  return (
    <motion.div ref={ref} style={{ x, y }}>
      {children}
    </motion.div>
  );
}

// Fade-in animation wrapper
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Industry card component
function IndustryCard({ icon, title, delay }: { icon: string; title: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100 cursor-pointer group"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <p className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">{title}</p>
    </motion.div>
  );
}

// Feature card component
function FeatureCard({ icon: Icon, title, description, delay }: { icon: any; title: string; description: string; delay: number }) {
  return (
    <FadeIn delay={delay} className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-white mb-6 shadow-lg shadow-orange-500/25">
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </FadeIn>
  );
}

// Step component
function Step({ number, title, description, delay }: { number: string; title: string; description: string; delay: number }) {
  return (
    <FadeIn delay={delay} className="flex gap-6">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-orange-500/25">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </FadeIn>
  );
}

export default function Home() {
  const [url, setUrl] = useState('');
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });
  
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const handleGetStarted = () => {
    if (url.trim()) {
      window.location.href = `/quick?url=${encodeURIComponent(url.trim())}`;
    } else {
      window.location.href = '/quick';
    }
  };

  return (
    <div className="bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight">
              <GradientText>KwikReel</GradientText>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How it Works</a>
            <a href="#industries" className="text-gray-400 hover:text-white transition-colors">Industries</a>
          </div>
          <Link 
            href="/quick"
            className="px-5 py-2.5 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section - Olipop Style */}
      <section ref={heroRef} className="relative min-h-[120vh] flex items-center justify-center overflow-hidden bg-black">
        {/* Dramatic gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-950/50 via-black to-black" />
          <motion.div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(234,88,12,0.4) 0%, rgba(220,38,38,0.2) 40%, transparent 70%)',
            }}
            animate={{ 
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Floating parallax elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Large floating icons */}
          <FloatingElement 
            className="absolute top-[15%] left-[10%]" 
            speed={0.3} 
            delay={0.2}
          >
            <MouseParallax strength={30}>
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-2xl shadow-orange-500/50 rotate-12">
                <Film className="text-white" size={36} />
              </div>
            </MouseParallax>
          </FloatingElement>

          <FloatingElement 
            className="absolute top-[20%] right-[12%]" 
            speed={0.5} 
            delay={0.4}
          >
            <MouseParallax strength={25}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-pink-500/50 -rotate-12">
                <Mic className="text-white" size={28} />
              </div>
            </MouseParallax>
          </FloatingElement>

          <FloatingElement 
            className="absolute bottom-[30%] left-[8%]" 
            speed={0.4} 
            delay={0.6}
          >
            <MouseParallax strength={35}>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/50 rotate-6">
                <ImageIcon className="text-white" size={24} />
              </div>
            </MouseParallax>
          </FloatingElement>

          <FloatingElement 
            className="absolute bottom-[25%] right-[15%]" 
            speed={0.35} 
            delay={0.8}
          >
            <MouseParallax strength={28}>
              <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/50 -rotate-6 p-4">
                <Video className="text-white" size={32} />
              </div>
            </MouseParallax>
          </FloatingElement>

          {/* Floating orbs */}
          <motion.div
            className="absolute top-[30%] left-[25%] w-4 h-4 rounded-full bg-orange-500"
            animate={{
              y: [0, -30, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="absolute top-[40%] right-[20%] w-3 h-3 rounded-full bg-red-500"
            animate={{
              y: [0, -40, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          />
          <motion.div
            className="absolute bottom-[35%] left-[30%] w-2 h-2 rounded-full bg-pink-500"
            animate={{
              y: [0, -25, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
          />
          <motion.div
            className="absolute top-[50%] right-[30%] w-3 h-3 rounded-full bg-yellow-500"
            animate={{
              y: [0, -35, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 1.5 }}
          />

          {/* Sparkle particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${10 + Math.random() * 80}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <motion.div 
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-orange-400 text-sm font-medium mb-8 border border-white/20"
          >
            <Sparkles size={16} />
            AI-Powered Video Ads
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-[0.95] mb-8"
          >
            <span className="text-white">Your next</span>
            <br />
            <span className="text-white">customer is</span>
            <br />
            <GradientText>one video away.</GradientText>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Paste your website. Get a professional video ad.
            <span className="text-white font-semibold"> 60 seconds.</span>
          </motion.p>

          {/* URL Input */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-full border border-white/20">
              <div className="flex-1 relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter your website URL"
                  className="w-full bg-white/10 rounded-xl sm:rounded-full pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 backdrop-blur-sm"
                />
              </div>
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 rounded-xl sm:rounded-full font-semibold text-white transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 group"
              >
                Create Video
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • Free to try
            </p>
          </motion.div>

          {/* Floating labels */}
          <div className="mt-16 flex flex-wrap justify-center gap-4">
            {['Script', 'Voiceover', 'Visuals', 'Video'].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full text-sm font-medium text-gray-300 border border-white/10"
              >
                ✓ {item}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-white text-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Everything you need.
              <br />
              <span className="text-gray-400">Nothing you don't.</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              KwikReel handles the complexity of video production so you can focus on running your business.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard
              icon={Zap}
              title="Instant Generation"
              description="From website URL to finished video ad in under 60 seconds. No editing skills required."
              delay={0.1}
            />
            <FeatureCard
              icon={Globe}
              title="Auto-Scraping"
              description="We analyze your website to understand your brand, services, and unique selling points."
              delay={0.2}
            />
            <FeatureCard
              icon={Clock}
              title="Save Hours"
              description="What used to take days of planning, filming, and editing now happens automatically."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 bg-gray-50 text-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <FadeIn>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                  Three steps.
                  <br />
                  <GradientText>That's it.</GradientText>
                </h2>
              </FadeIn>
              
              <div className="space-y-10 mt-12">
                <Step
                  number="1"
                  title="Paste your website"
                  description="Enter your business URL. Our AI analyzes your brand, services, testimonials, and more."
                  delay={0.1}
                />
                <Step
                  number="2"
                  title="We create your ad"
                  description="AI generates a persuasive script, professional imagery, and voiceover — all matched to your brand."
                  delay={0.2}
                />
                <Step
                  number="3"
                  title="Download & share"
                  description="Get your finished video ad ready for Facebook, Instagram, YouTube, or your website."
                  delay={0.3}
                />
              </div>
            </div>

            {/* Visual demo */}
            <FadeIn delay={0.2}>
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.02, rotateY: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    
                    {/* URL bar */}
                    <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-xl">
                      <Globe size={18} className="text-gray-400" />
                      <span className="text-gray-600">smithroofing.com</span>
                    </div>

                    {/* Progress steps */}
                    <div className="space-y-3 py-4">
                      {[
                        { text: 'Analyzing website...', done: true },
                        { text: 'Writing script...', done: true },
                        { text: 'Generating visuals...', done: true },
                        { text: 'Creating voiceover...', done: true },
                      ].map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.15 }}
                          viewport={{ once: true }}
                          className="flex items-center gap-3"
                        >
                          <CheckCircle2 size={20} className="text-green-500" />
                          <span className="text-gray-700">{step.text}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Output preview */}
                    <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🎬</div>
                        <p className="text-gray-600 font-medium">Your video is ready!</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Decorative elements */}
                <div className="absolute -z-10 top-8 -right-8 w-full h-full bg-gradient-to-br from-orange-200 to-red-200 rounded-3xl opacity-50" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="py-32 bg-white text-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Built for <GradientText>your industry</GradientText>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Pre-trained on thousands of contractor websites. We know what works.
            </p>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <IndustryCard icon="🏠" title="Roofing" delay={0} />
            <IndustryCard icon="🎨" title="Painting" delay={0.05} />
            <IndustryCard icon="🔧" title="Plumbing" delay={0.1} />
            <IndustryCard icon="⚡" title="Electrical" delay={0.15} />
            <IndustryCard icon="❄️" title="HVAC" delay={0.2} />
            <IndustryCard icon="🌳" title="Landscaping" delay={0.25} />
            <IndustryCard icon="🪟" title="Windows" delay={0.3} />
            <IndustryCard icon="🚿" title="Remodeling" delay={0.35} />
            <IndustryCard icon="🏗️" title="General" delay={0.4} />
            <IndustryCard icon="🧱" title="Masonry" delay={0.45} />
            <IndustryCard icon="🚪" title="Flooring" delay={0.5} />
            <IndustryCard icon="🏡" title="Siding" delay={0.55} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-black relative overflow-hidden">
        {/* Background animation */}
        <motion.div 
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-red-600/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.3, 1, 1.3],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
              Ready to get more customers?
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Join hundreds of contractors who are already using KwikReel to book more jobs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quick"
                className="px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2 group"
              >
                Start Free
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight">
                <GradientText>KwikReel</GradientText>
              </span>
              <span className="text-gray-600">by Barbarian Labs</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="mailto:support@kwikreel.ai" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-sm text-gray-600">
              © 2026 KwikReel. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
