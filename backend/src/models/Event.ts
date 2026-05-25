import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  type: { 
    type: String, 
    enum: [
      'page_view', 'click', 'scroll', 'add_to_cart', 'remove_from_cart', 
      'checkout_started', 'purchase_completed', 'rage_click', 'dead_click', 
      'form_error', 'custom'
    ], 
    required: true 
  },
  url: { type: String, required: true },
  x: { type: Number },
  y: { type: Number },
  normalizedX: { type: Number },
  normalizedY: { type: Number },
  targetSelector: { type: String },
  targetText: { type: String },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: mongoose.Schema.Types.Mixed },
});

// Since we'll query events frequently by session and project
eventSchema.index({ projectId: 1, type: 1 });
eventSchema.index({ sessionId: 1, timestamp: 1 });

export const Event = mongoose.model('Event', eventSchema);
