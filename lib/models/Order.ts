import mongoose, { Schema } from 'mongoose';
import { IOrder, OrderStatus } from '@/types';

const OrderProductSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      unique: true,
      trim: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    customerAddress: {
      type: String,
      trim: true,
    },
    products: {
      type: [OrderProductSchema],
      required: true,
      validate: {
        validator: (products: any[]) => products.length > 0,
        message: 'Order must have at least one product',
      },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['new', 'confirmed', 'in_progress', 'delivered', 'cancelled'],
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
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

// Generate order number before saving - MUST be before model creation
OrderSchema.pre('save', async function (next) {
  if (!this.isNew || this.orderNumber) {
    return next();
  }
  try {
    // Generate order number based on timestamp + random
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderNumber = `ORD-${timestamp}-${random}`;
    next();
  } catch (error: any) {
    next(error);
  }
});

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
