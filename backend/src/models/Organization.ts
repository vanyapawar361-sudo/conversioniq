import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  plan: { type: String, enum: ['Free', 'Pro', 'Enterprise'], default: 'Free' },
  stripeCustomerId: { type: String },
}, { timestamps: true });

export const Organization = mongoose.model('Organization', organizationSchema);
