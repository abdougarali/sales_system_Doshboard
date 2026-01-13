import { Document, Types } from 'mongoose';

// User Types (Simple - password only for single admin)
export interface IUser extends Document {
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Lead Types
export type Platform = 'instagram' | 'messenger' | 'whatsapp';
export type ReplyStatus = 'yes' | 'no' | 'seen' | 'no_reply';
export type InterestLevel = 'interested' | 'not_interested' | 'pending';
export type LeadStatus = 'new' | 'contacted' | 'replied' | 'demo_sent' | 'converted' | 'lost';

export interface ILead extends Document {
  brandName: string;
  instagramHandle?: string;
  platform: Platform;
  dateContacted?: Date;
  replyStatus?: ReplyStatus;
  interestLevel?: InterestLevel;
  demoSent: boolean;
  status: LeadStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Product Types
export interface IProduct extends Document {
  name: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Order Types
export type OrderStatus = 'new' | 'confirmed' | 'in_progress' | 'delivered' | 'cancelled';

export interface IOrderProduct {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  products: IOrderProduct[];
  totalAmount: number;
  status: OrderStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
