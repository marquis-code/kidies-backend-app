import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting, SettingDocument } from './schemas/setting.schema';

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(@InjectModel(Setting.name) private settingModel: Model<SettingDocument>) {}

  async onModuleInit() {
    const setting = await this.settingModel.findOne({ key: 'global' });
    if (!setting) {
      console.log('Seeding initial global settings...');
      await this.settingModel.create({
        key: 'global',
        storefront: {
          heroCarousel: [
            {
              imageUrl: '/img/hero_fall_1_1789165261484.jpg',
              title: 'ICONIC\\nFOR\\nAUTUMN',
              subtitle: "Charming outfits for the season's best moments.",
              ctaText: 'Shop Boys',
              ctaLink: '/category/boy'
            }
          ],
          featuredCategories: [
            { title: 'Shop Boy', imageUrl: '/img/category_boy_1789165301016.jpg', link: '/category/boy' },
            { title: 'Shop Baby', imageUrl: '/img/category_baby_1789165311089.jpg', link: '/category/baby' },
            { title: 'Shop Girl', imageUrl: '/img/category_girl_1789165322757.jpg', link: '/category/girl' }
          ],
          brandStory: {
            section1Title: 'Kids Clothes',
            section1Text: 'Hold onto childhood with kids clothes from JasmarKids, where every style is made to celebrate the magic of being a kid.',
            section2Title: 'Girls & Boys Clothes',
            section2Text: 'Discover the sweetest girls clothes and coolest boys clothes made for every adventure.',
            section3Title: 'Baby Clothes',
            section3Text: 'Celebrate their earliest moments with baby clothes from JasmarKids.'
          }
        }
      });
    }
  }

  async getStorefrontSettings() {
    const setting = await this.settingModel.findOne({ key: 'global' }).lean();
    return setting?.storefront || {};
  }

  async updateStorefrontSettings(payload: any) {
    const setting = await this.settingModel.findOneAndUpdate(
      { key: 'global' },
      { $set: { storefront: payload } },
      { new: true, upsert: true }
    ).lean();
    return setting.storefront;
  }
}
