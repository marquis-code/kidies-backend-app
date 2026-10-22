import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

export const ORDER_STATUSES = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
] as const;

export const PAYMENT_STATUSES = ['Unpaid', 'Paid', 'Refunded'] as const;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true, index: true })
  orderNumber: string;

  @Prop({ type: Object, required: true })
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state?: string;
    country: string;
    zipCode: string;
    phone?: string;
  };

  @Prop([
    {
      productId: { type: Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      quantity: Number,
      sku: String,
      size: String,
      color: String,
      image: String,
    },
  ])
  items: any[];

  @Prop({ required: true })
  subtotal: number;

  @Prop({ required: true, default: 0 })
  shippingFee: number;

  @Prop({ required: true, default: 0 })
  tax: number;

  @Prop({ default: 0 })
  discountAmount: number;

  @Prop()
  couponCode: string;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ default: 'USD' })
  currency: string;

  @Prop({
    enum: ['paystack', 'stripe', 'cash_on_delivery', 'check'],
    default: 'paystack',
  })
  paymentMethod: string;

  @Prop({ type: String })
  paystackReference: string;

  @Prop({ type: String })
  stripeSessionId: string;

  @Prop({ type: String })
  paymentReference: string;

  @Prop({ enum: ORDER_STATUSES, default: 'Pending' })
  status: string;

  @Prop({ enum: PAYMENT_STATUSES, default: 'Unpaid' })
  paymentStatus: string;

  @Prop()
  paidAt?: Date;

  @Prop()
  notes?: string;

  @Prop([
    {
      status: String,
      changedAt: { type: Date, default: Date.now },
      note: String,
    },
  ])
  statusHistory: any[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ 'customer.email': 1, createdAt: -1 });
