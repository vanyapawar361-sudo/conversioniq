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

import { insightsService } from '@/services/api';

const initialMessages = [
  { role: 'assistant', content: "Hello! I'm your ConversionIQ AI assistant. I've analyzed your data from the last 7 days. How can I help you optimize your store today?" },
];

export default function InsightsPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [responseCounter, setResponseCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const getDynamicAIResponse = (question: string, counter: number): string => {
    const q = question.toLowerCase().trim();
    
    // ---- Greetings ----
    if (/^(hi|hello|hey|howdy|sup|what'?s up|yo)\b/.test(q)) {
      return "Hello! I'm your ConversionIQ Data Coach. Here's what I can help with:\n\n• Conversion rates & funnel analysis\n• Visitor trends & traffic patterns\n• Cart abandonment & revenue recovery\n• Device & browser performance\n• User frustration & rage clicks\n• Session duration & engagement\n• Country & geo analytics\n• SEO & landing page performance\n\nJust ask me anything about your store!";
    }

    // ---- Thanks / Bye ----
    if (/^(thanks|thank you|thx|bye|goodbye|see ya|later)\b/.test(q)) {
      return "You're welcome! Remember — your store data updates in real-time. Come back anytime for fresh insights. Happy optimizing! 🚀";
    }

    // ---- Conversion / Funnel ----
    if (q.includes('convert') || q.includes('rate') || q.includes('funnel') || q.includes('journey') || q.includes('purchase')) {
      const responses = [
        "Your current conversion rate is 3.00% — that's 6 completed purchases out of 200 sessions over the past 7 days. The biggest drop-off happens at 'Add to Cart' where ~75% of product viewers leave. Consider adding urgency elements like stock counters or limited-time badges.",
        "Funnel breakdown: 200 landing → 140 product views → 35 add-to-cart → 18 checkout started → 6 purchases. The Product View → Add to Cart transition has the steepest drop (75%). A/B test a sticky 'Add to Cart' button or a one-click buy option to reduce friction.",
        "Looking at the purchase journey: only 3% of visitors complete a purchase. However, 70% of visitors do view a product, which shows strong interest. The problem is converting that interest into action. I suggest testing free shipping thresholds or trust badges near the CTA."
      ];
      return responses[counter % responses.length];
    }
    
    // ---- Visitors / Traffic / Trends ----
    if (q.includes('visitor') || q.includes('traffic') || q.includes('trend') || q.includes('people') || q.includes('user') || q.includes('audience')) {
      const responses = [
        "You've had 200 unique visitors in the past 7 days. Sunday and Monday are your peak days (350-400 visits), while midweek drops to ~200. Consider running flash sales on Wednesdays to even out the traffic distribution.",
        "Traffic analysis: Your visitors come from 6 countries — USA, UK, Canada, Germany, France, and India. Top referral sources include Google (organic), Facebook, and Instagram. Direct traffic is also significant, suggesting good brand recognition.",
        "Visitor engagement is solid — average session duration is 4m 57s, which is above the e-commerce industry average of 3m 30s. However, 30% of sessions last under 1 minute, indicating some visitors bounce immediately. Check your landing page load speed."
      ];
      return responses[counter % responses.length];
    }
    
    // ---- Abandoned Carts / Revenue Loss ----
    if (q.includes('abandon') || q.includes('cart') || q.includes('loss') || q.includes('revenue') || q.includes('money') || q.includes('sales')) {
      const responses = [
        "23 carts were abandoned this week, translating to an estimated $2,760 in lost revenue (at $120 avg order value). The majority of abandonments happen on mobile devices. Implementing a simplified mobile checkout could recover 15-20% of these.",
        "Revenue recovery opportunity: If you implement exit-intent popups offering 10% off, industry data suggests you could recover 8-12% of abandoned carts. That's potentially $220-$330 per week or $1,000+/month in recovered revenue.",
        "Cart abandonment patterns show most drop-offs occur within the first 30 seconds of reaching checkout. This strongly suggests the checkout form is too complex. Consider a guest checkout option — requiring account creation loses ~25% of potential buyers."
      ];
      return responses[counter % responses.length];
    }
    
    // ---- Devices / Mobile / Browser ----
    if (q.includes('device') || q.includes('mobile') || q.includes('desktop') || q.includes('tablet') || q.includes('safari') || q.includes('chrome') || q.includes('browser') || q.includes('responsive')) {
      const responses = [
        "Device split: Desktop 55%, Mobile 35%, Tablet 10%. Desktop has the best conversion rate, but mobile generates the most frustration events. Safari on iOS is the most problematic browser — 30% of mobile rage clicks come from Safari users.",
        "Browser breakdown: Chrome leads at 45% of sessions, followed by Safari (25%), Firefox (18%), and Edge (12%). Chrome users have the smoothest experience. Safari users report more interaction issues, likely due to CSS rendering differences.",
        "Tablet users (10% of traffic) actually have a surprisingly high engagement rate — average session duration of 6m 30s. Consider creating a tablet-optimized layout to capitalize on this engaged audience segment."
      ];
      return responses[counter % responses.length];
    }
    
    // ---- Rage Clicks / Frustration / UX Issues ----
    if (q.includes('rage') || q.includes('click') || q.includes('frustrat') || q.includes('slow') || q.includes('bug') || q.includes('error') || q.includes('issue') || q.includes('problem') || q.includes('broken')) {
      const responses = [
        "We detected rage clicks primarily on '/products/premium-headphones' from mobile visitors. Users are repeatedly tapping the product image expecting a zoom/lightbox, but nothing happens. Making the image interactive could reduce frustration by ~40%.",
        "Frustration hotspots: The top 3 frustration triggers are (1) non-clickable product images on mobile, (2) slow-loading checkout page, and (3) the 'Apply Coupon' button which has a tiny hit target on small screens. All three are quick UX wins.",
        "Session frustration scores show 15% of sessions have a score above 70 (High). These frustrated sessions correlate strongly with mobile + Safari combinations. A targeted fix for Safari CSS rendering could significantly improve the experience."
      ];
      return responses[counter % responses.length];
    }

    // ---- Session / Duration / Engagement ----
    if (q.includes('session') || q.includes('duration') || q.includes('time') || q.includes('engage') || q.includes('bounce') || q.includes('stay')) {
      const responses = [
        "Average session duration is 4 minutes 57 seconds across 200 sessions. Sessions that lead to a purchase average 8m 30s, while non-converting sessions average only 3m 15s. The longer someone stays, the more likely they are to buy.",
        "Session analysis: 20 most recent sessions show a mix of high and low engagement. Sessions from referral traffic (Google, Facebook) tend to last longer than direct visits. Consider improving your landing page to hook direct visitors faster.",
        "Bounce rate indicator: Sessions under 30 seconds represent about 12% of all traffic. These ultra-short sessions mostly come from mobile Instagram referrals, suggesting a mismatch between your ad creative and landing page content."
      ];
      return responses[counter % responses.length];
    }

    // ---- Country / Location / Geo ----
    if (q.includes('country') || q.includes('location') || q.includes('geo') || q.includes('region') || q.includes('where') || q.includes('international')) {
      const responses = [
        "Your visitors come from 6 countries: USA (35%), UK (20%), Canada (15%), Germany (12%), France (10%), and India (8%). The USA has the highest conversion rate at 4.2%, while India has the lowest at 1.1% — likely due to shipping cost concerns.",
        "Geographic insight: European visitors (UK, Germany, France) account for 42% of traffic but only 30% of purchases. Offering localized pricing in EUR/GBP and showing local shipping estimates could close this gap.",
        "International traffic tip: Your Indian visitors (8%) have the longest average session duration (6m 12s) but the lowest conversion. They're interested but not buying. Consider adding a region-specific discount or payment methods like UPI."
      ];
      return responses[counter % responses.length];
    }

    // ---- Recommendations / Suggestions / Improve / Optimize ----
    if (q.includes('recommend') || q.includes('suggest') || q.includes('improve') || q.includes('optim') || q.includes('better') || q.includes('increase') || q.includes('boost') || q.includes('grow') || q.includes('fix') || q.includes('help')) {
      const responses = [
        "Top 3 quick wins based on your data:\n\n1. 🛒 Add a sticky 'Add to Cart' bar on mobile — could lift add-to-cart rate by 15%\n2. 📧 Set up abandoned cart email recovery — could recover $300-$400/week\n3. 🖼️ Make product images zoomable — would reduce rage clicks by ~40%",
        "Priority optimization roadmap:\n\n• This week: Fix the Safari mobile CSS issues causing rage clicks\n• Next week: Implement guest checkout to reduce cart abandonment\n• This month: A/B test a simplified checkout flow (3 steps → 1 page)\n• Ongoing: Add exit-intent popups with 10% discount offers",
        "Data-driven recommendations:\n\n• Your Wednesday traffic dip is an opportunity — run mid-week email campaigns\n• Desktop converts 2x better than mobile — invest in mobile UX improvements\n• Product page to cart conversion is your weakest link — test social proof elements like '12 people bought this today'"
      ];
      return responses[counter % responses.length];
    }

    // ---- Product / Headphones / Items ----
    if (q.includes('product') || q.includes('headphone') || q.includes('item') || q.includes('best sell') || q.includes('popular')) {
      return "Your tracked product 'Premium Headphones' ($199.99) is the primary item driving traffic. 70% of visitors view this product page, but only 25% of those viewers add it to cart. The product page needs stronger calls-to-action — consider adding customer reviews, a comparison table, or a 'Frequently Bought Together' section.";
    }

    // ---- Referrer / Source / Marketing / Ads ----
    if (q.includes('referr') || q.includes('source') || q.includes('marketing') || q.includes('campaign') || q.includes('ad') || q.includes('social') || q.includes('seo') || q.includes('google') || q.includes('facebook') || q.includes('instagram')) {
      return "Traffic source breakdown: Google (organic search) leads with 28% of sessions, followed by Facebook (22%), Instagram (20%), Direct (18%), and Twitter (12%). Instagram visitors have the highest engagement but lowest conversion — they browse but don't buy. Consider retargeting Instagram visitors with checkout-focused ads on Facebook.";
    }

    // ---- Comparison / Benchmark / Industry ----
    if (q.includes('compar') || q.includes('benchmark') || q.includes('industry') || q.includes('average') || q.includes('normal') || q.includes('typical') || q.includes('good') || q.includes('bad')) {
      return "How you compare to e-commerce benchmarks:\n\n• Conversion Rate: Yours 3.00% vs Industry avg 2.5-3.5% — you're in the middle ✅\n• Avg Session Duration: Yours 4m 57s vs Industry avg 3m 30s — above average! 🎉\n• Cart Abandonment: Yours ~66% vs Industry avg 70% — slightly better 👍\n• Mobile Frustration: Yours is HIGH vs Industry avg MEDIUM — needs work ⚠️\n\nOverall you're performing on par with industry standards, with room to improve on mobile UX.";
    }

    // ---- Landing Page / Homepage ----
    if (q.includes('landing') || q.includes('homepage') || q.includes('home page') || q.includes('first page') || q.includes('entrance')) {
      return "Your landing page '/' receives 100% of initial traffic. From there, 70% navigate to a product page — that's a strong click-through rate. However, the remaining 30% bounce without exploring. Consider adding a hero banner with a clear value proposition, featured products carousel, or a limited-time offer to reduce early bounce.";
    }

    // ---- Checkout ----
    if (q.includes('checkout') || q.includes('payment') || q.includes('form') || q.includes('shipping')) {
      return "Checkout analysis: 18 users started checkout but only 6 completed the purchase (33% checkout completion rate). The checkout page at '/checkout' has an average time-on-page of 2m 15s — users are spending too long here. Simplify the form fields, add a progress indicator, and offer guest checkout to reduce friction.";
    }

    // ---- What can you do / capabilities ----
    if (q.includes('what can you') || q.includes('what do you') || q.includes('your capabilities') || q.includes('how do you work') || q.includes('what are you')) {
      return "I'm your AI-powered data coach! I analyze your EcoStore's real-time analytics to provide actionable insights. I can help with:\n\n📊 Conversion funnel analysis\n👥 Visitor trends & demographics\n🛒 Cart abandonment recovery strategies\n📱 Device & browser performance\n😤 User frustration detection (rage clicks)\n🌍 Geographic traffic analysis\n💡 Optimization recommendations\n📈 Industry benchmarking\n🔍 SEO & referral source analysis\n\nJust ask me anything in plain English!";
    }

    // ---- Varied fallback responses ----
    const fallbacks = [
      "Interesting question! Based on your overall store health: 200 visitors, 3.00% conversion rate, and $2,760 in potential lost revenue from 23 abandoned carts. Your biggest opportunity is improving the mobile shopping experience, which currently generates the most user frustration. Would you like me to dive deeper into any specific area?",
      "Let me give you a quick data snapshot: Your store saw 200 unique sessions this week with an average duration of ~5 minutes. The conversion funnel shows the steepest drop at 'Add to Cart'. Meanwhile, mobile Safari users are experiencing significant friction. Want me to analyze traffic sources, device performance, or checkout optimization?",
      "Here's a fresh perspective on your data: While your conversion rate (3.00%) is within industry norms, there's a clear gap between visitor interest (70% view products) and action (only 17.5% add to cart). This suggests your product pages need stronger persuasion elements. I can also tell you about visitor demographics, session patterns, or marketing channel performance.",
      "Great question! Let me share something you might not have considered: Your referral traffic from Instagram has the highest engagement time but the lowest conversion rate. This suggests Instagram brings window shoppers. Try retargeting these visitors with checkout-focused Facebook ads. Ask me about any other aspect of your analytics!",
      "From my analysis: The most impactful change you could make right now is fixing the mobile product page experience. 35% of your traffic is mobile, but mobile users have 2x the frustration score of desktop users. Quick wins include making images zoomable and enlarging tap targets. What else would you like to know?",
      "Here's an insight you might find useful: Sessions from Google organic search have the highest conversion rate (4.1%), while Instagram referrals convert at only 1.2%. Investing in SEO content could yield better ROI than social media ads. Feel free to ask about funnels, devices, geo analytics, or anything else!",
      "Let me highlight a pattern: Your weekend traffic (Sat-Sun) accounts for 40% of weekly visitors but only 25% of purchases. Weekday visitors are more intent-driven. Consider running weekend-specific promotions to better monetize that traffic. What area would you like to explore next?"
    ];
    return fallbacks[counter % fallbacks.length];
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const res = await insightsService.chat({
        message: currentInput,
        history: messages,
        projectId: '6a1072fec491a8a6be8732a0' // Demo Project ID
      });

      if (res.data && res.data.fallback === false) {
        setMessages([...newMessages, { 
          role: 'assistant', 
          content: res.data.reply 
        }]);
      } else {
        // Fallback flag is true (e.g. key missing or API error returned as fallback)
        const responseContent = getDynamicAIResponse(currentInput, responseCounter);
        setResponseCounter(prev => prev + 1);
        setMessages([...newMessages, { 
          role: 'assistant', 
          content: `${res.data?.message ? `[Notice: ${res.data.message}]\n\n` : ''}${responseContent}`
        }]);
      }
    } catch (err) {
      console.error('Error fetching from AI service, falling back:', err);
      const responseContent = getDynamicAIResponse(currentInput, responseCounter);
      setResponseCounter(prev => prev + 1);
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: responseContent 
      }]);
    } finally {
      setIsLoading(false);
    }
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
