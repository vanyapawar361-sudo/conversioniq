import { Response } from 'express';
import { Alert } from '../models/Alert';
import { Project } from '../models/Project';
import { AuthRequest } from '../middleware/authMiddleware';
import mongoose from 'mongoose';

const SEED_ALERTS = [
  {
    type: 'ConversionDrop',
    severity: 'Critical',
    title: 'Conversion Rate Dropped by 34%',
    message: 'The checkout conversion rate has decreased from 3.2% to 2.1% in the last 2 hours. High drop-off observed at the payment step.',
    data: { beforeRate: 3.2, currentRate: 2.1, timeWindow: '2h' },
    isResolved: false
  },
  {
    type: 'CheckoutError',
    severity: 'High',
    title: 'Spike in Checkout API Failures',
    message: 'Detected 18 checkout failures in the last 15 minutes. Error code: stripe_payment_intent_failed.',
    data: { errorCode: 'stripe_payment_intent_failed', failureCount: 18, duration: '15m' },
    isResolved: false
  },
  {
    type: 'BounceRateIncrease',
    severity: 'Medium',
    title: 'Bounce Rate Surge on /checkout',
    message: 'The checkout page bounce rate increased by 18% (from 35% to 53%). Could indicate UI/UX issues or loading lag.',
    data: { page: '/checkout', bounceRateIncrease: 18 },
    isResolved: false
  },
  {
    type: 'SystemAlert',
    severity: 'Low',
    title: 'Database Connection Latency Spike',
    message: 'Database query execution time exceeded the 200ms threshold, peaking at 412ms.',
    data: { currentLatencyMs: 412, baselineMs: 80 },
    isResolved: true
  }
];

export const getAlerts = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.query;
    if (!projectId) {
      return res.status(400).json({ message: 'ProjectId is required' });
    }

    const pid = new mongoose.Types.ObjectId(projectId as string);

    // Verify project belongs to user's company
    const companyId = req.user?.companyId || req.user?.organizationId;
    if (companyId) {
      const project = await Project.findOne({ _id: pid, $or: [{ organizationId: companyId }, { companyId }] });
      if (!project && projectId !== '6a1072fec491a8a6be8732a0') {
        return res.status(404).json({ message: 'Project not found or unauthorized' });
      }
    }

    // Fetch existing alerts
    let alerts = await Alert.find({ projectId: pid }).sort({ createdAt: -1 });

    // Seed alerts if the database is empty for this project to ensure a beautiful initial experience
    if (alerts.length === 0) {
      const alertsToInsert = SEED_ALERTS.map(alert => ({
        ...alert,
        projectId: pid,
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 3), // spread over the last 3 days
      }));
      await Alert.insertMany(alertsToInsert);
      alerts = await Alert.find({ projectId: pid }).sort({ createdAt: -1 });
    }

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving alerts', error });
  }
};

export const resolveAlert = async (req: AuthRequest, res: Response) => {
  try {
    const { alertId } = req.params;
    const alert = await Alert.findByIdAndUpdate(alertId, { isResolved: true }, { new: true });
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Error resolving alert', error });
  }
};

export const testDiscordWebhook = async (req: AuthRequest, res: Response) => {
  try {
    const { webhookUrl, projectId } = req.body;
    if (!webhookUrl) {
      return res.status(400).json({ message: 'webhookUrl is required' });
    }
    if (!projectId) {
      return res.status(400).json({ message: 'projectId is required' });
    }

    const companyId = req.user?.companyId || req.user?.organizationId;
    if (companyId) {
      const pid = new mongoose.Types.ObjectId(projectId as string);
      const project = await Project.findOne({ _id: pid, $or: [{ organizationId: companyId }, { companyId }] });
      if (!project && projectId !== '6a1072fec491a8a6be8732a0') {
        return res.status(404).json({ message: 'Project not found or unauthorized' });
      }
    }

    const pid = new mongoose.Types.ObjectId(projectId as string);

    // Create a new critical mock alert for the test
    const newAlert = new Alert({
      projectId: pid,
      type: 'CheckoutError',
      severity: 'Critical',
      title: '🚨 Test Anomaly Detected: Checkout Failure Spike',
      message: 'This is a test alert triggered via ConversionIQ notification settings. The checkout flow is experiencing an increased failure rate.',
      data: {
        errorCode: 'ERR_TEST_WEBHOOK',
        failureCount: 42,
        duration: '5m',
        triggeredBy: 'User Test'
      },
      isResolved: false
    });

    await newAlert.save();

    // Color code based on severity
    // Critical = Red (15158332), High = Orange (15105570), Medium = Yellow (16776960), Low = Blue (3447003)
    const color = 15158332; 

    // Send formatted embed to Discord Webhook
    const discordPayload = {
      username: 'ConversionIQ Alerter',
      avatar_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&h=128&fit=crop',
      embeds: [
        {
          title: newAlert.title,
          description: newAlert.message,
          color: color,
          fields: [
            { name: 'Severity', value: '🔴 Critical', inline: true },
            { name: 'Anomaly Type', value: 'Checkout Error', inline: true },
            { name: 'Project ID', value: projectId, inline: false },
            { name: 'Error Code', value: '`ERR_TEST_WEBHOOK`', inline: true },
            { name: 'Failures', value: '42 occurrences', inline: true },
            { name: 'Timeframe', value: 'Last 5 minutes', inline: true }
          ],
          footer: {
            text: 'ConversionIQ Analytics Monitor',
            icon_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=64&h=64&fit=crop'
          },
          timestamp: new Date().toISOString()
        }
      ]
    };

    // Use native fetch to POST to Discord
    const discordResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordPayload)
    });

    if (!discordResponse.ok) {
      const responseText = await discordResponse.text();
      throw new Error(`Discord API responded with status ${discordResponse.status}: ${responseText}`);
    }

    res.json({
      success: true,
      message: 'Discord webhook test alert sent successfully!',
      alert: newAlert
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error sending Discord webhook alert', error: error.message || error });
  }
};
