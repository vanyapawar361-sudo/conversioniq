import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const projectSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  name: { type: String, required: true },
  domain: { type: String, required: true },
  trackingId: { type: String, unique: true, default: uuidv4 },
}, { timestamps: true });

export const Project = mongoose.model('Project', projectSchema);
