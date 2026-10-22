import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ enum: ['customer', 'admin'], default: 'customer' })
  role: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop()
  resetPasswordToken?: string;

  @Prop()
  resetPasswordExpires?: Date;

  @Prop()
  phoneNumber?: string;

  @Prop()
  zipCode?: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  otpCode?: string;

  @Prop()
  otpExpiresAt?: Date;

  // ---- Rewards System ----
  @Prop({ default: 0 })
  rewardPoints: number;

  @Prop({ default: 'Insider', enum: ['Insider', 'Stylist', 'Icon'] })
  rewardTier: string;

  @Prop({ default: 0 })
  totalSpent: number;

  // ---- Addresses ----
  @Prop({
    type: [{
      label: String,
      firstName: String,
      lastName: String,
      street: String,
      apt: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      phone: String,
      isDefault: { type: Boolean, default: false },
    }],
    default: [],
  })
  addresses: any[];

  // ---- Wishlist ----
  @Prop({ type: [String], default: [] })
  wishlist: string[];

  // ---- Payment Methods (card tokens – NOT full card numbers!) ----
  @Prop({
    type: [{
      type: { type: String, enum: ['credit_card', 'gift_card'] },
      last4: String,
      brand: String,
      expiryMonth: Number,
      expiryYear: Number,
      isDefault: { type: Boolean, default: false },
    }],
    default: [],
  })
  paymentMethods: any[];

  // ---- Preferences ----
  @Prop({ type: Object, default: { emailOffers: true, smsAlerts: false, language: 'en', currency: 'usd' } })
  preferences: {
    emailOffers: boolean;
    smsAlerts: boolean;
    language: string;
    currency: string;
  };

  // ---- Discounts / Applied Coupons ----
  @Prop({
    type: [{
      code: String,
      description: String,
      discountPercent: Number,
      validUntil: Date,
      type: { type: String, enum: ['savings', 'offer'] },
    }],
    default: [],
  })
  discounts: any[];

  // ---- Birthdays ----
  @Prop({
    type: [{
      childName: String,
      birthDate: Date,
    }],
    default: [],
  })
  birthdays: any[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Pre-save hook to hash password if modified
UserSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return;
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});
