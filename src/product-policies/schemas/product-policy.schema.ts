import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductPolicyDocument = ProductPolicy & Document;

@Schema({ timestamps: true })
export class ProductPolicy {
  @Prop({ required: true })
  name: string;

  @Prop()
  productDetails: string;

  @Prop()
  shippingAndReturns: string;
}

export const ProductPolicySchema = SchemaFactory.createForClass(ProductPolicy);
