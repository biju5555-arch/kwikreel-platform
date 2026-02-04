'use client';

import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, Play, Sparkles, Zap, Globe, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Animated gradient text component
function GradientText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
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
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const handleGetStarted = () => {
    if (url.trim()) {
      window.location.href = `/quick?url=${encodeURIComponent(url.trim())}`;
    } else {
      window.location.href = '/quick';
    }
  };

  return (
    <div className="bg-white text-gray-900 overflow-x-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight">
              <GradientText>KwikReel</GradientText>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
            <a href="#industries" className="text-gray-600 hover:text-gray-900 transition-colors">Industries</a>
          </div>
          <Link 
            href="/quick"
            className="px-5 py-2.5 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50/50 via-white to-white" />
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-200/30 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full text-orange-700 text-sm font-medium mb-8"
          >
            <Sparkles size={16} />
            AI-Powered Video Ads for Contractors
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Your next customer is
            <br />
            <GradientText>one video away.</GradientText>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Paste your website. Get a professional video ad. 
            <span className="text-gray-900 font-medium"> 60 seconds.</span>
          </motion.p>

          {/* URL Input */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-3 p-2 bg-gray-100 rounded-2xl sm:rounded-full">
              <div className="flex-1 relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter your website URL"
                  className="w-full bg-white rounded-xl sm:rounded-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
                />
              </div>
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-xl sm:rounded-full font-semibold text-white transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 group"
              >
                Create Video
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • Free to try
            </p>
          </motion.div>

          {/* Demo video preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-16 relative"
          >
            <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-gray-300/50 border border-gray-200">
              <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group"
                >
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <Play size={28} className="text-gray-900 ml-1" />
                  </div>
                </motion.button>
              </div>
              {/* Floating elements */}
              <motion.div 
                className="absolute top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium shadow-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
              >
                🎬 Website → Video Ad
              </motion.div>
              <motion.div 
                className="absolute bottom-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium shadow-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 }}
              >
                ⚡ 60 seconds
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-gray-300 flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-3 bg-gray-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-white">
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
      <section id="how-it-works" className="py-32 bg-gray-50">
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
      <section id="industries" className="py-32 bg-white">
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
      <section className="py-32 bg-gray-900 relative overflow-hidden">
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
              <button className="px-8 py-4 border border-gray-700 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors inline-flex items-center justify-center gap-2">
                <Play size={18} />
                Watch Demo
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight">
                <GradientText>KwikReel</GradientText>
              </span>
              <span className="text-gray-400">by Barbarian Labs</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
            </div>
            <p className="text-sm text-gray-400">
              © 2026 KwikReel. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
