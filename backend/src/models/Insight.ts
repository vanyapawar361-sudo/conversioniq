import mongoose from 'mongoose';

const insightSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  type: { type: String, enum: ['Bottleneck', 'Recommendation', 'Alert'], required: true },
  severity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  content: { type: String, required: true }, // The AI-generated explanation
  context: { type: mongoose.Schema.Types.Mixed }, // Store relevant URLs, funnels or products
  isDismissed: { type: Boolean, default: false }
}, { timestamps: true });

export const Insight = mongoose.model('Insight', insightSchema);
