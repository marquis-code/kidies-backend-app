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
exports.SettingsService = exports.DEFAULT_GENERAL_SETTINGS = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const setting_schema_1 = require("./schemas/setting.schema");
exports.DEFAULT_GENERAL_SETTINGS = {
    storeName: 'JasmarKids',
    storeEmail: 'hello@jasmarkids.com',
    phone: '+1 (555) 010-2030',
    address: '128 Maple Street, Brooklyn, NY 11201',
    currency: 'USD',
    shippingFee: 5.95,
    freeShippingThreshold: 30,
    taxRate: 8,
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    announcement: 'Extra 40% Off* Sale With Code EXTRA40',
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
        section1Text: 'Hold onto childhood with kids clothes from JasmarKids, where every style is made to celebrate the magic of being a kid.',
        section2Title: 'Girls & Boys Clothes',
        section2Text: 'Discover the sweetest girls clothes and coolest boys clothes made for every adventure.',
        section3Title: 'Baby Clothes',
        section3Text: "Celebrate their earliest moments with baby clothes from JasmarKids.",
    },
};
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
                storefront: DEFAULT_STOREFRONT,
                general: exports.DEFAULT_GENERAL_SETTINGS,
            });
            return;
        }
        if (!setting.general || Object.keys(setting.general).length === 0) {
            setting.general = { ...exports.DEFAULT_GENERAL_SETTINGS };
            await setting.save();
        }
    }
    async getStorefrontSettings() {
        const setting = await this.settingModel.findOne({ key: 'global' }).lean();
        return { ...DEFAULT_STOREFRONT, ...(setting?.storefront || {}) };
    }
    async updateStorefrontSettings(payload) {
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
        return { ...exports.DEFAULT_GENERAL_SETTINGS, ...(setting?.general || {}) };
    }
    async updateGeneralSettings(payload) {
        const current = await this.getGeneralSettings();
        const merged = { ...current };
        const allowed = Object.keys(exports.DEFAULT_GENERAL_SETTINGS);
        const requiredKeys = ['storeName', 'storeEmail', 'currency'];
        for (const key of allowed) {
            const value = payload[key];
            if (value === undefined)
                continue;
            if (requiredKeys.includes(key) && String(value).trim() === '')
                continue;
            if (['shippingFee', 'freeShippingThreshold', 'taxRate'].includes(key) && value === '')
                continue;
            merged[key] = value;
        }
        ['shippingFee', 'freeShippingThreshold', 'taxRate'].forEach((key) => {
            if (merged[key] !== undefined && merged[key] !== '') {
                const num = Number(merged[key]);
                if (Number.isFinite(num) && num >= 0)
                    merged[key] = num;
            }
        });
        if (merged.taxRate > 100)
            merged.taxRate = 100;
        if (merged.currency)
            merged.currency = String(merged.currency).toUpperCase();
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
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(setting_schema_1.Setting.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SettingsService);
//# sourceMappingURL=settings.service.js.map