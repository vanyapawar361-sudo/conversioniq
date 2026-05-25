import mongoose from 'mongoose';

const replayDataSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  events: { type: Array, required: true }, // Array of rrweb event objects or similar format
}, { timestamps: true });

export const ReplayData = mongoose.model('ReplayData', replayDataSchema);
