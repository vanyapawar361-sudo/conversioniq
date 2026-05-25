import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Zap, 
  BarChart3, 
  MousePointer2, 
  ShieldCheck,
  Play,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Zap className="text-white w-6 h-6 fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight">ConversionIQ</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold hover:text-indigo-600 transition-colors">Log in</Link>
            <Link href="/dashboard" className="px-5 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            AI-Powered Conversion Optimization
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Understand why they <span className="text-indigo-600">don't purchase.</span>
          </h1>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            ConversionIQ uses AI to analyze visitor behavior, session replays, and funnels to find exactly where you're losing money.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-zinc-900 text-white rounded-full font-bold hover:bg-black transition-all flex items-center justify-center gap-2 group">
              Start Building Your Funnel
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-white border border-zinc-200 rounded-full font-bold hover:bg-zinc-50 transition-all flex items-center justify-center gap-2">
              <Play className="w-4 h-4 fill-current" />
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to optimize</h2>
            <p className="text-zinc-500">Stop guessing. Start knowing with data-driven insights.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={BarChart3}
              title="Funnel Analytics"
              description="Identify the exact step where users drop off and why."
            />
            <FeatureCard 
              icon={MousePointer2}
              title="Heatmaps"
              description="Visualize exactly where users are clicking and scrolling."
            />
            <FeatureCard 
              icon={Zap}
              title="AI Recommendations"
              description="Get actionable advice on how to improve your UI/UX."
            />
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-2">
            <p className="text-4xl font-bold">12.5%</p>
            <p className="text-sm text-zinc-500 font-medium uppercase tracking-widest">Avg. Conversion Lift</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-bold">12k+</p>
            <p className="text-sm text-zinc-500 font-medium uppercase tracking-widest">Active Storefronts</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-bold">$2.4M</p>
            <p className="text-sm text-zinc-500 font-medium uppercase tracking-widest">Revenue Recovered</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-zinc-400 font-medium">
          &copy; 2026 ConversionIQ. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: any) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-zinc-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-zinc-500 leading-relaxed">{description}</p>
    </div>
  );
}
