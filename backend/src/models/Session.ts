import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  visitorId: { type: String, required: true }, // generated on client
  browser: { type: String },
  os: { type: String },
  device: { type: String },
  country: { type: String },
  referrer: { type: String },
  landingPage: { type: String },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  duration: { type: Number }, // in seconds
  frustrationScore: { type: Number, default: 0 }
}, { timestamps: true });

export const Session = mongoose.model('Session', sessionSchema);
