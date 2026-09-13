import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StoreDocument = Store & Document;

export class GeoLocation {
  @Prop({ type: String, enum: ['Point'], default: 'Point', required: true })
  type: string;

  @Prop({ type: [Number], required: true }) // [longitude, latitude]
  coordinates: number[];
}

@Schema({ timestamps: true })
export class Store {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  zip: string;

  @Prop({ required: false })
  phone: string;

  @Prop({ type: GeoLocation, required: true, index: '2dsphere' })
  location: GeoLocation;
}

export const StoreSchema = SchemaFactory.createForClass(Store);
