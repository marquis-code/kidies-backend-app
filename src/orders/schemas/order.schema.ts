import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber: string;

  @Prop({ type: Object, required: true })
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    country: string;
    zipCode: string;
  };

  @Prop([
    {
      productId: { type: Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      quantity: Number,
      sku: String,
    },
  ])
  items: any[];

  @Prop({ required: true })
  subtotal: number;

  @Prop({ required: true, default: 0 })
  shippingFee: number;

  @Prop({ required: true, default: 0 })
  tax: number;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ enum: ['paystack', 'cash_on_delivery', 'check'], default: 'paystack' })
  paymentMethod: string;

  @Prop({ type: String })
  paystackReference: string;

  @Prop({ enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' })
  status: string;

  @Prop({ enum: ['Unpaid', 'Paid', 'Refunded'], default: 'Paid' })
  paymentStatus: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
