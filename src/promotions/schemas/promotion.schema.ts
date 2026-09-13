import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PromotionDocument = Promotion & Document;

@Schema({ timestamps: true })
export class Promotion {
  @Prop({ required: true })
  title: string;

  @Prop()
  subtitle: string;

  @Prop({ enum: ['hero', 'banner', 'megamenu_ad'], required: true })
  type: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop()
  backgroundColor: string;

  @Prop()
  ctaText: string;

  @Prop()
  ctaLink: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  categoryTarget: string; // E.g., 'boy', 'girl' (used for megamenu_ad to determine which menu it shows up in)

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
