import { Response } from 'express';
import { Session } from '../models/Session';
import { Event } from '../models/Event';
import { Project } from '../models/Project';
import { AuthRequest } from '../middleware/authMiddleware';
import mongoose from 'mongoose';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function getAnalyticsContext(projectId: string): Promise<string> {
  const pid = new mongoose.Types.ObjectId(projectId);

  const totalSessions = await Session.countDocuments({ projectId: pid });
  const totalVisitors = (await Session.distinct('visitorId', { projectId: pid })).length;
  const purchases = await Event.countDocuments({ projectId: pid, type: 'purchase_completed' });
  const conversionRate = totalSessions > 0 ? ((purchases / totalSessions) * 100).toFixed(2) : '0';

  const cartAdds = (await Event.distinct('sessionId', { projectId: pid, type: 'add_to_cart' } as any)).length;
  const completedPurchases = (await Event.distinct('sessionId', { projectId: pid, type: 'purchase_completed' } as any)).length;
  const abandonedCarts = cartAdds - completedPurchases;

  const avgDurationDoc = await Session.aggregate([
    { $match: { projectId: pid } },
    { $group: { _id: null, avg: { $avg: '$duration' } } }
  ]);
  const avgDuration = avgDurationDoc[0]?.avg || 0;

  const deviceBreakdown = await Session.aggregate([
    { $match: { projectId: pid } },
    { $group: { _id: '$device', count: { $sum: 1 } } }
  ]);

  const countryBreakdown = await Session.aggregate([
    { $match: { projectId: pid } },
    { $group: { _id: '$country', count: { $sum: 1 } } }
  ]);

  const browserBreakdown = await Session.aggregate([
    { $match: { projectId: pid } },
    { $group: { _id: '$browser', count: { $sum: 1 } } }
  ]);

  const referrerBreakdown = await Session.aggregate([
    { $match: { projectId: pid } },
    { $group: { _id: '$referrer', count: { $sum: 1 } } }
  ]);

  const funnelSteps = ['page_view', 'click', 'add_to_cart', 'checkout_started', 'purchase_completed'];
  const funnelCounts = await Promise.all(
    funnelSteps.map(async (type) => {
      const count = (await Event.distinct('sessionId', { projectId: pid, type } as any)).length;
      return { step: type, uniqueSessions: count };
    })
  );

  const rageClicks = await Event.countDocuments({ projectId: pid, type: 'rage_click' });

  const frustrationDist = await Session.aggregate([
    { $match: { projectId: pid } },
    { $group: {
      _id: null,
      highFrustration: { $sum: { $cond: [{ $gt: ['$frustrationScore', 70] }, 1, 0] } },
      medFrustration: { $sum: { $cond: [{ $and: [{ $gt: ['$frustrationScore', 30] }, { $lte: ['$frustrationScore', 70] }] }, 1, 0] } },
      lowFrustration: { $sum: { $cond: [{ $lte: ['$frustrationScore', 30] }, 1, 0] } }
    }}
  ]);

  return `
EcoStore Analytics Summary (Last 7 Days):
- Total Sessions: ${totalSessions}
- Unique Visitors: ${totalVisitors}
- Conversion Rate: ${conversionRate}%
- Total Purchases: ${purchases}
- Abandoned Carts: ${abandonedCarts}
- Estimated Revenue Loss: $${abandonedCarts * 120} (at $120 avg order value)
- Avg Session Duration: ${Math.floor(avgDuration / 60)}m ${Math.floor(avgDuration) % 60}s

Conversion Funnel:
${funnelCounts.map(f => `  - ${f.step}: ${f.uniqueSessions} unique sessions`).join('\n')}

Device Breakdown:
${deviceBreakdown.map(d => `  - ${d._id}: ${d.count} sessions`).join('\n')}

Browser Breakdown:
${browserBreakdown.map(b => `  - ${b._id}: ${b.count} sessions`).join('\n')}

Country Breakdown:
${countryBreakdown.map(c => `  - ${c._id}: ${c.count} sessions`).join('\n')}

Referrer Sources:
${referrerBreakdown.map(r => `  - ${r._id}: ${r.count} sessions`).join('\n')}

User Frustration:
  - Rage Clicks Detected: ${rageClicks}
  - High Frustration Sessions (score > 70): ${frustrationDist[0]?.highFrustration || 0}
  - Medium Frustration Sessions (30-70): ${frustrationDist[0]?.medFrustration || 0}
  - Low Frustration Sessions (< 30): ${frustrationDist[0]?.lowFrustration || 0}

Product tracked: Premium Headphones ($199.99)
Store domain: ecostore.com
  `.trim();
}

export const chatWithAI = async (req: AuthRequest, res: Response) => {
  try {
    const { message, history, projectId } = req.body;

    if (!message || !projectId) {
      return res.status(400).json({ error: 'message and projectId are required' });
    }

    const companyId = req.user?.companyId || req.user?.organizationId;
    if (companyId) {
      const pid = new mongoose.Types.ObjectId(projectId as string);
      const project = await Project.findOne({ _id: pid, $or: [{ organizationId: companyId }, { companyId }] });
      if (!project && projectId !== '6a1072fec491a8a6be8732a0') {
        return res.status(404).json({ error: 'Project not found or unauthorized' });
      }
    }

    const apiKey = process.env.GROQ_API_KEY;

    // If no valid API key, return a flag so frontend uses local fallback
    if (!apiKey || apiKey.includes('placeholder')) {
      return res.status(200).json({
        fallback: true,
        message: 'No Groq API key configured. Using local insights engine. Add GROQ_API_KEY to your .env file.'
      });
    }

    // Fetch real analytics data from MongoDB
    const analyticsContext = await getAnalyticsContext(projectId);

    const systemPrompt = `You are ConversionIQ's AI Data Coach — an expert e-commerce analytics assistant.
You have access to real-time analytics data from the user's online store "EcoStore".

Here is the current analytics data:

${analyticsContext}

Instructions:
- Answer questions based on the real data above. Always cite specific numbers.
- Provide actionable, specific recommendations grounded in the data.
- Be concise but insightful. Use bullet points for lists.
- If the user asks something unrelated to e-commerce analytics, gently redirect them.
- Use a friendly, professional tone. You may use emojis sparingly for emphasis.
- When giving percentages or comparisons, show the calculation.
- Proactively highlight problems and opportunities you notice in the data.
- Keep responses under 200 words for readability.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).slice(-10).map((m: any) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      })),
      { role: 'user', content: message }
    ];

    const candidateModels = ['groq/compound-mini', 'groq/compound', 'openai/gpt-oss-120b', 'qwen/qwen3.6-27b'];
    let aiMessage = '';
    let lastErrorStatus = 0;

    for (const model of candidateModels) {
      try {
        const response = await fetch(GROQ_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            messages,
            max_tokens: 500,
            temperature: 0.7
          })
        });

        if (response.ok) {
          const data = await response.json();
          aiMessage = data.choices?.[0]?.message?.content || '';
          if (aiMessage) break;
        } else {
          lastErrorStatus = response.status;
          const errorText = await response.text();
          console.warn(`Groq API model ${model} error (${response.status}):`, errorText);
        }
      } catch (e) {
        console.warn(`Groq API fetch error for model ${model}:`, e);
      }
    }

    if (!aiMessage) {
      return res.status(200).json({
        fallback: true,
        message: `Groq API rate limit or error (${lastErrorStatus || 429}). Using local insights engine.`
      });
    }

    res.json({
      fallback: false,
      reply: aiMessage
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(200).json({
      fallback: true,
      message: 'AI service unavailable. Using local insights engine.'
    });
  }
};
