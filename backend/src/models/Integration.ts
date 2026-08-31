import mongoose from 'mongoose';

const integrationSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  platform: { 
    type: String, 
    enum: ['Shopify', 'WooCommerce', 'Amazon', 'Flipkart', 'CSV'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['connected', 'syncing', 'error', 'disconnected'], 
    default: 'connected' 
  },
  credentials: { type: mongoose.Schema.Types.Mixed, default: {} },
  lastSync: { type: Date, default: Date.now },
}, { timestamps: true });

export const Integration = mongoose.model('Integration', integrationSchema);
