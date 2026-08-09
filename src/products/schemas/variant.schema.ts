import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VariantDocument = Variant & Document;

@Schema({ timestamps: true })
export class Variant {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true, index: true })
  productId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  sku: string;

  @Prop()
  color: string;

  @Prop()
  size: string;

  @Prop()
  material: string;

  @Prop({ default: 0 })
  priceModifier: number;

  @Prop({ type: Object })
  image: {
    cloudinaryPublicId: string;
    thumbnailUrl: string;
    mediumUrl: string;
  };

  @Prop({ default: true })
  isActive: boolean;
}

export const VariantSchema = SchemaFactory.createForClass(Variant);
