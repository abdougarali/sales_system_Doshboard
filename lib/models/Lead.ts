import mongoose, { Schema } from 'mongoose';
import { ILead, Platform, ReplyStatus, InterestLevel, LeadStatus } from '@/types';

const LeadSchema = new Schema<ILead>(
  {
    brandName: {
      type: String,
      required: true,
      trim: true,
    },
    instagramHandle: {
      type: String,
      trim: true,
    },
    platform: {
      type: String,
      enum: ['instagram', 'messenger', 'whatsapp'],
      required: true,
    },
    dateContacted: {
      type: Date,
    },
    replyStatus: {
      type: String,
      enum: ['yes', 'no', 'seen', 'no_reply'],
    },
    interestLevel: {
      type: String,
      enum: ['interested', 'not_interested', 'pending'],
    },
    demoSent: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'replied', 'demo_sent', 'converted', 'lost'],
      default: 'new',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
LeadSchema.index({ status: 1 });
LeadSchema.index({ brandName: 1 });

const Lead = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;
