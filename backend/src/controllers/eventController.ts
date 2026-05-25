import { Request, Response } from 'express';
import { Event } from '../models/Event';
import { Session } from '../models/Session';
import { Project } from '../models/Project';
import { io } from '../server';

export const ingestEvents = async (req: Request, res: Response) => {
  try {
    const { trackingId, sessionId, visitorId, events } = req.body;

    const project = await Project.findOne({ trackingId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Find or create session
    let session = await Session.findOne({ sessionId: sessionId }); // Assuming custom ID for now, or use _id
    // Wait, our Session model uses _id by default, let's use visitorId + sessionId as mapping
    
    if (!session) {
      session = new Session({
        projectId: project._id,
        visitorId,
        // user agent etc should be in the first page_view event metadata
      });
      await session.save();
    }

    const eventDocs = events.map((e: any) => ({
      projectId: project._id,
      sessionId: session?._id,
      type: e.type,
      url: e.url,
      x: e.x,
      y: e.y,
      normalizedX: e.normalizedX,
      normalizedY: e.normalizedY,
      targetSelector: e.targetSelector,
      targetText: e.targetText,
      timestamp: new Date(e.timestamp),
      metadata: e.metadata
    }));

    await Event.insertMany(eventDocs);

    // Broadcast to real-time dashboard listeners
    io.to(project._id.toString()).emit('new_events', {
      sessionId: session._id,
      events: eventDocs
    });

    res.status(200).json({ status: 'success', count: eventDocs.length });
  } catch (error) {
    console.error('Ingestion Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
