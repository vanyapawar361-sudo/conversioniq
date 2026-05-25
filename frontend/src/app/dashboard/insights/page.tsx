'use client';

import React, { useState } from 'react';
import { Shell } from '@/components/layout/Shell';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles,
  RefreshCcw,
  Lightbulb
} from 'lucide-react';

const initialMessages = [
  { role: 'assistant', content: "Hello! I'm your ConversionIQ AI assistant. I've analyzed your data from the last 7 days. How can I help you optimize your store today?" },
];

export default function InsightsPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    // Mock AI response for now
    setTimeout(() => {
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: "Based on my analysis, your mobile conversion rate dropped because of a 3.4s delay in the checkout script loading. I recommend prioritizing that asset." 
      }]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Shell>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-500" />
              AI Insights
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">Ask anything about your store's performance.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 rounded-xl text-sm font-medium hover:bg-indigo-100 transition-colors">
            <RefreshCcw className="w-4 h-4" />
            Recalculate Insights
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 font-semibold">
              <Lightbulb className="w-5 h-5" />
              Top Recommendation
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Simplify your checkout form. Removing the "Phone Number" field could increase conversions by approximately **12%** based on current drop-off patterns.
            </p>
            <button className="text-sm font-medium text-indigo-600 hover:underline">See detailed analysis →</button>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-orange-600 font-semibold">
              <AlertCircle className="w-5 h-5" /> // Wait, AlertCircle not imported correctly or I should use AlertTriangle
              Critical Insight
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Mobile users are experiencing high "Rage Clicks" on the homepage banner. The CTA link might be broken on Safari iOS.
            </p>
            <button className="text-sm font-medium text-orange-600 hover:underline">Watch session replays →</button>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-lg flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex gap-3", m.role === 'user' ? "flex-row-reverse" : "")}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  m.role === 'user' ? "bg-zinc-100 text-zinc-600" : "bg-indigo-100 text-indigo-600"
                )}>
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={cn(
                   "p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed",
                   m.role === 'user' ? "bg-indigo-600 text-white rounded-tr-none" : "bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-200 rounded-tl-none text-zinc-800"
                )}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse text-sm text-zinc-400">
                  Analyzing data...
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask your data coach..." 
                className="w-full pl-4 pr-12 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function AlertCircle({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
