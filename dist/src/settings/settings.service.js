"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const setting_schema_1 = require("./schemas/setting.schema");
let SettingsService = class SettingsService {
    settingModel;
    constructor(settingModel) {
        this.settingModel = settingModel;
    }
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
    async updateStorefrontSettings(payload) {
        const setting = await this.settingModel.findOneAndUpdate({ key: 'global' }, { $set: { storefront: payload } }, { new: true, upsert: true }).lean();
        return setting.storefront;
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(setting_schema_1.Setting.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SettingsService);
//# sourceMappingURL=settings.service.js.map