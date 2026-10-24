import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting, SettingDocument } from './schemas/setting.schema';

export const DEFAULT_GENERAL_SETTINGS = {
  storeName: 'JasmarKids',
  storeEmail: 'hello@jasmarkids.com',
  phone: '+234 800 JASMARKIDS',
  address: 'Online Boutique — Nationwide Delivery Across Nigeria',
  currency: 'NGN',
  shippingFee: 2500,
  freeShippingThreshold: 50000,
  taxRate: 7.5,
  instagram: 'https://instagram.com/jasmarkids',
  facebook: 'https://facebook.com/jasmarkids',
  twitter: 'https://twitter.com/jasmarkids',
  announcement: 'Vibrant Outfits for African Kids • Nationwide Delivery Across Nigeria',
};

const DEFAULT_STOREFRONT = {
  heroCarousel: [
    {
      imageUrl: '/img/hero_fall_1_1789165261484.jpg',
      title: 'ICONIC\nFOR\nAUTUMN',
      subtitle: "Charming outfits for the season's best moments.",
      ctaText: 'Shop Boys',
      ctaLink: '/category/boy',
    },
  ],
  featuredCategories: [
    { title: 'Shop Boy', imageUrl: '/img/category_boy_1789165301016.jpg', link: '/category/boy' },
    { title: 'Shop Baby', imageUrl: '/img/category_baby_1789165311089.jpg', link: '/category/baby' },
    { title: 'Shop Girl', imageUrl: '/img/category_girl_1789165322757.jpg', link: '/category/girl' },
  ],
  brandStory: {
    section1Title: 'Kids Clothes',
    section1Text:
      'Hold onto childhood with kids clothes from JasmarKids, where every style is made to celebrate the magic of being a kid.',
    section2Title: 'Girls & Boys Clothes',
    section2Text:
      'Discover the sweetest girls clothes and coolest boys clothes made for every adventure.',
    section3Title: 'Baby Clothes',
    section3Text: "Celebrate their earliest moments with baby clothes from JasmarKids.",
  },
};

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(@InjectModel(Setting.name) private settingModel: Model<SettingDocument>) {}

  async onModuleInit() {
    const setting = await this.settingModel.findOne({ key: 'global' });
    if (!setting) {
      console.log('Seeding initial global settings...');
      await this.settingModel.create({
        key: 'global',
        storefront: DEFAULT_STOREFRONT,
        general: DEFAULT_GENERAL_SETTINGS,
      });
      return;
    }
    if (!setting.general || Object.keys(setting.general).length === 0) {
      setting.general = { ...DEFAULT_GENERAL_SETTINGS };
      await setting.save();
    }
  }

  async getStorefrontSettings() {
    const setting = await this.settingModel.findOne({ key: 'global' }).lean();
    return { ...DEFAULT_STOREFRONT, ...(setting?.storefront || {}) };
  }

  async updateStorefrontSettings(payload: any) {
    const current = await this.getStorefrontSettings();
    const storefront = {
      heroCarousel: Array.isArray(payload?.heroCarousel)
        ? payload.heroCarousel
        : current.heroCarousel,
      featuredCategories: Array.isArray(payload?.featuredCategories)
        ? payload.featuredCategories
        : current.featuredCategories,
      brandStory: payload?.brandStory || current.brandStory,
    };

    const setting = await this.settingModel
      .findOneAndUpdate({ key: 'global' }, { $set: { storefront } }, { new: true, upsert: true })
      .lean();
    return setting.storefront;
  }

  async getGeneralSettings() {
    const setting = await this.settingModel.findOne({ key: 'global' }).lean();
    return { ...DEFAULT_GENERAL_SETTINGS, ...(setting?.general || {}) };
  }

  async updateGeneralSettings(payload: any) {
    const current = await this.getGeneralSettings();
    const merged: any = { ...current };
    const allowed = Object.keys(DEFAULT_GENERAL_SETTINGS);
    const requiredKeys = ['storeName', 'storeEmail', 'currency'];

    for (const key of allowed) {
      const value = payload[key];
      if (value === undefined) continue;
      // Never let an empty form field wipe a required setting.
      if (requiredKeys.includes(key) && String(value).trim() === '') continue;
      if (['shippingFee', 'freeShippingThreshold', 'taxRate'].includes(key) && value === '') continue;
      merged[key] = value;
    }

    ['shippingFee', 'freeShippingThreshold', 'taxRate'].forEach((key) => {
      if (merged[key] !== undefined && merged[key] !== '') {
        const num = Number(merged[key]);
        if (Number.isFinite(num) && num >= 0) merged[key] = num;
      }
    });
    if (merged.taxRate > 100) merged.taxRate = 100;
    if (merged.currency) merged.currency = String(merged.currency).toUpperCase();

    const setting = await this.settingModel
      .findOneAndUpdate({ key: 'global' }, { $set: { general: merged } }, { new: true, upsert: true })
      .lean();
    return setting.general;
  }

  async getAll() {
    const [storefront, general] = await Promise.all([
      this.getStorefrontSettings(),
      this.getGeneralSettings(),
    ]);
    return { storefront, general };
  }
}
