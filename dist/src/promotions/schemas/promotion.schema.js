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
exports.PromotionSchema = exports.Promotion = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Promotion = class Promotion {
    title;
    subtitle;
    type;
    imageUrl;
    backgroundColor;
    ctaText;
    ctaLink;
    isActive;
    categoryTarget;
    startDate;
    endDate;
};
exports.Promotion = Promotion;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Promotion.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Promotion.prototype, "subtitle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['hero', 'banner', 'megamenu_ad'], required: true }),
    __metadata("design:type", String)
], Promotion.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Promotion.prototype, "imageUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Promotion.prototype, "backgroundColor", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Promotion.prototype, "ctaText", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Promotion.prototype, "ctaLink", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Promotion.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Promotion.prototype, "categoryTarget", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Promotion.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Promotion.prototype, "endDate", void 0);
exports.Promotion = Promotion = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Promotion);
exports.PromotionSchema = mongoose_1.SchemaFactory.createForClass(Promotion);
//# sourceMappingURL=promotion.schema.js.map