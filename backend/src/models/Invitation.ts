import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  email: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Owner', 'Admin', 'Analyst', 'Viewer'], 
    required: true 
  },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'expired'], 
    default: 'pending' 
  }
}, { timestamps: true });

export const Invitation = mongoose.model('Invitation', invitationSchema);
