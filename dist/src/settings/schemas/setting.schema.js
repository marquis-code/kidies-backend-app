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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingSchema = exports.Setting = exports.StorefrontSettings = exports.FeaturedCategory = exports.HeroCarouselItem = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let HeroCarouselItem = class HeroCarouselItem {
    imageUrl;
    title;
    subtitle;
    ctaText;
    ctaLink;
};
exports.HeroCarouselItem = HeroCarouselItem;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HeroCarouselItem.prototype, "imageUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HeroCarouselItem.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HeroCarouselItem.prototype, "subtitle", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HeroCarouselItem.prototype, "ctaText", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HeroCarouselItem.prototype, "ctaLink", void 0);
exports.HeroCarouselItem = HeroCarouselItem = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], HeroCarouselItem);
const HeroCarouselItemSchema = mongoose_1.SchemaFactory.createForClass(HeroCarouselItem);
let FeaturedCategory = class FeaturedCategory {
    title;
    imageUrl;
    link;
};
exports.FeaturedCategory = FeaturedCategory;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], FeaturedCategory.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], FeaturedCategory.prototype, "imageUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], FeaturedCategory.prototype, "link", void 0);
exports.FeaturedCategory = FeaturedCategory = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], FeaturedCategory);
const FeaturedCategorySchema = mongoose_1.SchemaFactory.createForClass(FeaturedCategory);
let StorefrontSettings = class StorefrontSettings {
    heroCarousel;
    featuredCategories;
    brandStory;
};
exports.StorefrontSettings = StorefrontSettings;
__decorate([
    (0, mongoose_1.Prop)({ type: [HeroCarouselItemSchema], default: [] }),
    __metadata("design:type", Array)
], StorefrontSettings.prototype, "heroCarousel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [FeaturedCategorySchema], default: [] }),
    __metadata("design:type", Array)
], StorefrontSettings.prototype, "featuredCategories", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], StorefrontSettings.prototype, "brandStory", void 0);
exports.StorefrontSettings = StorefrontSettings = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], StorefrontSettings);
const StorefrontSettingsSchema = mongoose_1.SchemaFactory.createForClass(StorefrontSettings);
let Setting = class Setting {
    key;
    storefront;
    general;
};
exports.Setting = Setting;
__decorate([
    (0, mongoose_1.Prop)({ unique: true, default: 'global' }),
    __metadata("design:type", String)
], Setting.prototype, "key", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: StorefrontSettingsSchema, default: {} }),
    __metadata("design:type", StorefrontSettings)
], Setting.prototype, "storefront", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], Setting.prototype, "general", void 0);
exports.Setting = Setting = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Setting);
exports.SettingSchema = mongoose_1.SchemaFactory.createForClass(Setting);
//# sourceMappingURL=setting.schema.js.map