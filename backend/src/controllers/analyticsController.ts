import { Request, Response } from 'express';
import { Session } from '../models/Session';
import { Event } from '../models/Event';
import { Project } from '../models/Project';
import mongoose from 'mongoose';

export const getOverview = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.query;
    if (!projectId) return res.status(400).json({ message: 'ProjectId required' });

    const pid = new mongoose.Types.ObjectId(projectId as string);

    // Total visitors (unique visitorId)
    const totalVisitors = await Session.distinct('visitorId', { projectId: pid });
    
    // Total sessions
    const totalSessions = await Session.countDocuments({ projectId: pid });

    // Conversion rate (purchase_completed / total sessions)
    const purchases = await Event.countDocuments({ projectId: pid, type: 'purchase_completed' });
    const conversionRate = totalSessions > 0 ? (purchases / totalSessions) * 100 : 0;

    // Abandoned carts (add_to_cart but no purchase_completed in same session)
    // This is a bit complex for a single query, let's approximate for the demo
    const cartAdds = await Event.distinct('sessionId', { projectId: pid, type: 'add_to_cart' } as any);
    const completedPurchases = await Event.distinct('sessionId', { projectId: pid, type: 'purchase_completed' } as any);
    const abandonedCarts = cartAdds.length - completedPurchases.length;

    // Revenue loss (abandonedCarts * avg order value)
    const revenueLoss = abandonedCarts * 120; // Assume $120 avg

    // Avg session duration
    const avgDurationDoc = await Session.aggregate([
      { $match: { projectId: pid } },
      { $group: { _id: null, avg: { $avg: '$duration' } } }
    ]);
    const avgDuration = avgDurationDoc[0]?.avg || 0;

    res.json({
      totalVisitors: totalVisitors.length,
      conversionRate: conversionRate.toFixed(2) + '%',
      abandonedCarts,
      revenueLoss: '$' + revenueLoss.toLocaleString(),
      avgSessionTime: Math.floor(avgDuration / 60) + 'm ' + (Math.floor(avgDuration) % 60) + 's',
      trends: [
        { name: 'Mon', visitors: 400, conversion: 24 },
        { name: 'Tue', visitors: 300, conversion: 13 },
        { name: 'Wed', visitors: 200, conversion: 98 },
        { name: 'Thu', visitors: 278, conversion: 39 },
        { name: 'Fri', visitors: 189, conversion: 48 },
        { name: 'Sat', visitors: 239, conversion: 38 },
        { name: 'Sun', visitors: 349, conversion: 43 },
      ]
    });
  } catch (error) {
    res.status(500).json({ message: 'Analytics error', error });
  }
};

export const getFunnel = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.query;
    const pid = new mongoose.Types.ObjectId(projectId as string);

    const steps = [
      { name: 'Landing', type: 'page_view' },
      { name: 'Product View', type: 'click' },
      { name: 'Add to Cart', type: 'add_to_cart' },
      { name: 'Checkout', type: 'checkout_started' },
      { name: 'Purchase', type: 'purchase_completed' }
    ];

    const funnelData = await Promise.all(steps.map(async (step) => {
      const count = await Event.distinct('sessionId', { projectId: pid, type: step.type } as any);
      return {
        step: step.name,
        count: count.length
      };
    }));

    // Calculate drops
    const dataWithDrops = funnelData.map((step, i) => {
      if (i === 0) return { ...step, drop: 0 };
      const prevCount = funnelData[i-1]?.count || 0;
      const drop = prevCount > 0 ? ((prevCount - step.count) / prevCount) * 100 : 0;
      return { ...step, drop: parseFloat(drop.toFixed(1)) };
    });

    res.json(dataWithDrops);
  } catch (error) {
    res.status(500).json({ message: 'Funnel error', error });
  }
};

export const getSessions = async (req: Request, res: Response) => {
    try {
      const { projectId } = req.query;
      const pid = new mongoose.Types.ObjectId(projectId as string);
      
      const sessions = await Session.find({ projectId: pid })
        .sort({ startTime: -1 })
        .limit(20);
        
      res.json(sessions);
    } catch (error) {
       res.status(500).json({ message: 'Sessions error', error });
    }
}
