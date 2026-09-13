import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, index: true })
  name: string;

  @Prop({ required: true, unique: true })
  sku: string;

  @Prop()
  description: string;

  @Prop()
  additionalInformation: string;

  @Prop({ type: Number, default: 0 })
  averageRating: number;

  @Prop({ type: Number, default: 0 })
  reviewCount: number;

  @Prop({ type: Types.ObjectId, ref: 'Category', index: true })
  categoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'ProductPolicy' })
  policyId: Types.ObjectId;

  @Prop({ required: true })
  basePrice: number;

  @Prop()
  costPrice: number;

  @Prop([
    {
      cloudinaryPublicId: String,
      altText: String,
      isFeatured: Boolean,
      order: Number,
      uploadedAt: Date,
    },
  ])
  images: any[];

  @Prop({ type: Object })
  imageUrls: {
    thumbnail: string;
    medium: string;
    large: string;
    original: string;
  };

  @Prop([String])
  tags: string[];

  @Prop({ enum: ['draft', 'active', 'archived'], default: 'draft' })
  status: string;

  @Prop({ type: Object })
  seo: {
    title: string;
    description: string;
    slug: string;
  };

  @Prop()
  publishedAt: Date;

  @Prop([
    {
      size: String,
      color: String,
      sku: String,
      stockQuantity: { type: Number, default: 0 },
    }
  ])
  variants: any[];

  // ---- New filter fields ----
  @Prop({ enum: ['boy', 'girl', 'unisex'], default: 'unisex' })
  gender: string;

  @Prop([String])
  colors: string[];

  @Prop({ enum: ['girls-12m-12', 'boys-12m-12', 'baby-girls-0-24m', 'baby-boys-0-24m', 'toddler'], default: null })
  ageGroup: string;

  @Prop({ enum: ['tops', 'bottoms', 'dresses', 'sets', 'pajamas', 'shoes', 'boots', 'coats-jackets', 'denim-jackets', 'accessories', 'swimwear'], default: null })
  productType: string;

  @Prop({ type: [String], default: [] })
  keyFeatures: string[];

  @Prop({ type: [String], default: [] })
  sustainability: string[];

  @Prop([{ type: Types.ObjectId, ref: 'Product' }])
  relatedProducts: Types.ObjectId[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
