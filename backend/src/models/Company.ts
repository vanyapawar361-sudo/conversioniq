import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  plan: { type: String, enum: ['Free', 'Pro', 'Enterprise'], default: 'Free' },
  stripeCustomerId: { type: String },
}, { timestamps: true });

export const Company = mongoose.models.Company || mongoose.model('Company', companySchema);
export const Organization = Company; // Alias for backward compatibility
