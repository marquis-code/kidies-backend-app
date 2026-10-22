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
exports.PromotionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const promotion_schema_1 = require("./schemas/promotion.schema");
let PromotionsService = class PromotionsService {
    promotionModel;
    constructor(promotionModel) {
        this.promotionModel = promotionModel;
    }
    async findAll(query = {}) {
        const filter = {};
        if (query.isActive !== undefined) {
            filter.isActive = query.isActive === 'true' || query.isActive === true;
        }
        if (query.type) {
            filter.type = query.type;
        }
        if (query.categoryTarget) {
            filter.categoryTarget = query.categoryTarget;
        }
        return this.promotionModel.find(filter).sort({ createdAt: -1 }).exec();
    }
    async findOne(id) {
        const promotion = await this.promotionModel.findById(id).exec();
        if (!promotion) {
            throw new common_1.NotFoundException(`Promotion with ID ${id} not found`);
        }
        return promotion;
    }
    async create(createPromotionDto) {
        if (!createPromotionDto?.title || !String(createPromotionDto.title).trim()) {
            throw new common_1.BadRequestException('Promotion title is required');
        }
        if (!createPromotionDto?.imageUrl || !String(createPromotionDto.imageUrl).trim()) {
            throw new common_1.BadRequestException('Promotion image is required');
        }
        if (!['hero', 'banner', 'megamenu_ad'].includes(createPromotionDto?.type)) {
            throw new common_1.BadRequestException('Promotion type must be hero, banner or megamenu_ad');
        }
        const payload = { ...createPromotionDto };
        if (payload.isActive !== undefined) {
            payload.isActive = !(payload.isActive === false || payload.isActive === 'false');
        }
        const newPromotion = new this.promotionModel(payload);
        return newPromotion.save();
    }
    async update(id, updatePromotionDto) {
        const payload = { ...updatePromotionDto };
        if (payload.isActive !== undefined) {
            payload.isActive = !(payload.isActive === false || payload.isActive === 'false');
        }
        const updatedPromotion = await this.promotionModel.findByIdAndUpdate(id, payload, { new: true }).exec();
        if (!updatedPromotion) {
            throw new common_1.NotFoundException(`Promotion with ID ${id} not found`);
        }
        return updatedPromotion;
    }
    async remove(id) {
        const result = await this.promotionModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException(`Promotion with ID ${id} not found`);
        }
    }
};
exports.PromotionsService = PromotionsService;
exports.PromotionsService = PromotionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(promotion_schema_1.Promotion.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PromotionsService);
//# sourceMappingURL=promotions.service.js.map