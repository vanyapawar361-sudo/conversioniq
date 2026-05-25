import mongoose from 'mongoose';

const heatmapSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  url: { type: String, required: true },
  deviceType: { type: String, enum: ['Desktop', 'Tablet', 'Mobile'], default: 'Desktop' },
  clickData: [{
    x: { type: Number },
    y: { type: Number },
    value: { type: Number, default: 1 }
  }],
  scrollData: [{
    depth: { type: Number },
    count: { type: Number, default: 1 }
  }],
  screenshotUrl: { type: String },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

heatmapSchema.index({ projectId: 1, url: 1, deviceType: 1 });

export const Heatmap = mongoose.model('Heatmap', heatmapSchema);
