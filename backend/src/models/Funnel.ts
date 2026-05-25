import mongoose from 'mongoose';

const funnelSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  name: { type: String, required: true },
  steps: [{
    name: { type: String, required: true },
    eventType: { type: String, required: true }, // e.g., 'page_view', 'add_to_cart'
    pathMatch: { type: String }, // e.g., Regex or exact URL
    order: { type: Number, required: true }
  }],
}, { timestamps: true });

export const Funnel = mongoose.model('Funnel', funnelSchema);
