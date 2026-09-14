import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingDocument = Setting & Document;

@Schema({ _id: false })
export class HeroCarouselItem {
  @Prop()
  imageUrl: string;

  @Prop()
  title: string;

  @Prop()
  subtitle: string;

  @Prop()
  ctaText: string;

  @Prop()
  ctaLink: string;
}

const HeroCarouselItemSchema = SchemaFactory.createForClass(HeroCarouselItem);

@Schema({ _id: false })
export class FeaturedCategory {
  @Prop()
  title: string;

  @Prop()
  imageUrl: string;

  @Prop()
  link: string;
}

const FeaturedCategorySchema = SchemaFactory.createForClass(FeaturedCategory);

@Schema({ _id: false })
export class StorefrontSettings {
  @Prop({ type: [HeroCarouselItemSchema], default: [] })
  heroCarousel: HeroCarouselItem[];

  @Prop({ type: [FeaturedCategorySchema], default: [] })
  featuredCategories: FeaturedCategory[];

  @Prop({ type: Object, default: {} })
  brandStory: {
    section1Title: string;
    section1Text: string;
    section2Title: string;
    section2Text: string;
    section3Title: string;
    section3Text: string;
  };
}

const StorefrontSettingsSchema = SchemaFactory.createForClass(StorefrontSettings);

@Schema({ timestamps: true })
export class Setting {
  @Prop({ unique: true, default: 'global' })
  key: string; // "global"

  @Prop({ type: StorefrontSettingsSchema, default: {} })
  storefront: StorefrontSettings;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
