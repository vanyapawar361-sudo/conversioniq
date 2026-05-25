import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Member'], default: 'Member' },
  refreshToken: { type: String },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
