import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  type: { 
    type: String, 
    enum: ['ConversionDrop', 'CheckoutError', 'BounceRateIncrease', 'SystemAlert'], 
    required: true 
  },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed },
  isResolved: { type: Boolean, default: false },
}, { timestamps: true });

export const Alert = mongoose.model('Alert', alertSchema);
