import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InventoryDocument = Inventory & Document;

@Schema({ timestamps: true })
export class Inventory {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Variant', required: true, unique: true })
  variantId: Types.ObjectId;

  @Prop()
  warehouseId: string;

  @Prop({ required: true, default: 0 })
  quantityAvailable: number;

  @Prop({ default: 0 })
  quantityReserved: number;

  @Prop({ default: 5 })
  reorderLevel: number;

  @Prop()
  lastCountedAt: Date;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
