'use client';

import { motion } from 'framer-motion';
import { Check, X, ArrowRight, Zap, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';

function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
      {children}
    </span>
  );
}

interface ComparisonRow {
  feature: string;
  kwikreel: boolean | string;
  invideo: boolean | string;
  descript: boolean | string;
  creatify: boolean | string;
}

const comparisonData: ComparisonRow[] = [
  { feature: "Website URL to video", kwikreel: true, invideo: false, descript: false, creatify: true },
  { feature: "60-second generation", kwikreel: true, invideo: false, descript: false, creatify: false },
  { feature: "Auto script writing", kwikreel: true, invideo: true, descript: true, creatify: true },
  { feature: "AI voiceover", kwikreel: true, invideo: true, descript: true, creatify: true },
  { feature: "Face swap templates", kwikreel: true, invideo: false, descript: false, creatify: true },
  { feature: "Local business focus", kwikreel: true, invideo: false, descript: false, creatify: false },
  { feature: "No editing required", kwikreel: true, invideo: false, descript: false, creatify: true },
  { feature: "Free tier", kwikreel: true, invideo: true, descript: true, creatify: true },
  { feature: "Industry templates", kwikreel: "12+", invideo: "100+", descript: "50+", creatify: "20+" },
  { feature: "Starting price", kwikreel: "Free", invideo: "$25/mo", descript: "$15/mo", creatify: "$29/mo" },
];

function FeatureCell({ value }: { value: boolean | string }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="text-green-500 mx-auto" size={24} />
    ) : (
      <X className="text-gray-300 mx-auto" size={24} />
    );
  }
  return <span className="font-medium">{value}</span>;
}

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            <GradientText>KwikReel</GradientText>
          </Link>
          <Link 
            href="/quick"
            className="px-5 py-2.5 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            Try Free
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
          >
            KwikReel vs <GradientText>The Rest</GradientText>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            See how KwikReel compares to InVideo, Descript, Creatify, and other video creation tools.
          </motion.p>
        </div>
      </section>

      {/* Key Differentiators */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="text-orange-600" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">URL-First Approach</h3>
              <p className="text-gray-600">
                Just paste your website. No templates to browse, no assets to upload. We analyze your business and create the perfect ad.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Clock className="text-orange-600" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">60 Seconds, Not Hours</h3>
              <p className="text-gray-600">
                Other tools require editing skills and hours of work. KwikReel delivers a ready-to-post video ad in about a minute.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <DollarSign className="text-orange-600" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Built for Local Business</h3>
              <p className="text-gray-600">
                Pre-trained on thousands of local business websites. We understand contractors, restaurants, salons — your industry.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Feature Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-600">Feature</th>
                  <th className="py-4 px-4 text-center">
                    <div className="font-bold text-lg">
                      <GradientText>KwikReel</GradientText>
                    </div>
                  </th>
                  <th className="py-4 px-4 text-center font-semibold text-gray-600">InVideo</th>
                  <th className="py-4 px-4 text-center font-semibold text-gray-600">Descript</th>
                  <th className="py-4 px-4 text-center font-semibold text-gray-600">Creatify</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, i) => (
                  <motion.tr
                    key={row.feature}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4 font-medium">{row.feature}</td>
                    <td className="py-4 px-4 text-center bg-orange-50/50">
                      <FeatureCell value={row.kwikreel} />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <FeatureCell value={row.invideo} />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <FeatureCell value={row.descript} />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <FeatureCell value={row.creatify} />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Individual Comparisons */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">KwikReel vs InVideo</h2>
            <p className="text-gray-600 text-lg mb-4">
              InVideo is a powerful general-purpose video editor with 100+ templates. But it requires you to browse templates, customize text, add assets, and edit timelines. It's built for marketers who want control.
            </p>
            <p className="text-gray-600 text-lg">
              <strong>KwikReel is different.</strong> Paste your website URL and get a finished video ad in 60 seconds. No editing required. Perfect for busy business owners who need results, not another tool to learn.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6">KwikReel vs Descript</h2>
            <p className="text-gray-600 text-lg mb-4">
              Descript revolutionized editing with text-based video editing. It's incredible for podcasters, YouTubers, and content creators who already have footage to edit.
            </p>
            <p className="text-gray-600 text-lg">
              <strong>KwikReel creates from scratch.</strong> You don't need existing footage. We generate everything — script, visuals, voiceover — from just your website URL.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6">KwikReel vs Creatify</h2>
            <p className="text-gray-600 text-lg mb-4">
              Creatify also offers URL-to-video generation. It's a solid tool for e-commerce product videos and general marketing content.
            </p>
            <p className="text-gray-600 text-lg">
              <strong>KwikReel is built specifically for local businesses.</strong> Our AI is trained on contractors, restaurants, salons, and service businesses. We understand what works for local marketing — urgency, trust signals, and clear calls to action.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-black text-white px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to try the fastest way to create video ads?</h2>
          <p className="text-xl text-gray-400 mb-8">No credit card required. Your first video is free.</p>
          <Link
            href="/quick"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full font-semibold text-lg hover:from-orange-400 hover:to-red-500 transition-all"
          >
            Create Your Free Video
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500">
          <p>© 2026 KwikReel by Barbarian Labs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
