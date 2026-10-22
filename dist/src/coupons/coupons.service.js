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
exports.CouponsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const coupon_schema_1 = require("./coupon.schema");
let CouponsService = class CouponsService {
    couponModel;
    constructor(couponModel) {
        this.couponModel = couponModel;
    }
    async create(data) {
        if (!data?.code)
            throw new common_1.BadRequestException('Coupon code is required');
        const code = String(data.code).toUpperCase().trim();
        const existing = await this.couponModel.findOne({ code });
        if (existing)
            throw new common_1.BadRequestException('Coupon code already exists');
        const discountType = data.discountType || 'percentage';
        const discountValue = Number(data.discountValue);
        if (!['percentage', 'fixed'].includes(discountType)) {
            throw new common_1.BadRequestException('Discount type must be percentage or fixed');
        }
        if (!Number.isFinite(discountValue) || discountValue <= 0) {
            throw new common_1.BadRequestException('Discount value must be greater than zero');
        }
        if (discountType === 'percentage' && discountValue > 100) {
            throw new common_1.BadRequestException('Percentage discount cannot exceed 100');
        }
        const isActive = !(data.isActive === false || data.isActive === 'false' || data.isActive === 0);
        return this.couponModel.create({
            ...data,
            code,
            discountType,
            discountValue,
            minPurchaseAmount: Number(data.minPurchaseAmount) || 0,
            usageLimit: Number(data.usageLimit) || 0,
            isActive,
        });
    }
    async findAll() {
        return this.couponModel.find().sort({ createdAt: -1 }).exec();
    }
    async findOne(id) {
        const coupon = await this.couponModel.findById(id);
        if (!coupon)
            throw new common_1.NotFoundException('Coupon not found');
        return coupon;
    }
    async update(id, data) {
        const payload = { ...data };
        delete payload._id;
        delete payload.usedCount;
        if (payload.code) {
            payload.code = String(payload.code).toUpperCase().trim();
            const duplicate = await this.couponModel.findOne({ code: payload.code, _id: { $ne: id } });
            if (duplicate)
                throw new common_1.BadRequestException('Coupon code already exists');
        }
        if (payload.isActive !== undefined) {
            payload.isActive = !(payload.isActive === false || payload.isActive === 'false' || payload.isActive === 0);
        }
        if (payload.discountValue !== undefined) {
            const value = Number(payload.discountValue);
            if (!Number.isFinite(value) || value <= 0) {
                throw new common_1.BadRequestException('Discount value must be greater than zero');
            }
            payload.discountValue = value;
        }
        const updated = await this.couponModel.findByIdAndUpdate(id, payload, { new: true });
        if (!updated)
            throw new common_1.NotFoundException('Coupon not found');
        return updated;
    }
    async validate(code, subtotal) {
        if (!code)
            throw new common_1.BadRequestException('Coupon code is required');
        const coupon = await this.couponModel.findOne({ code: String(code).toUpperCase().trim() });
        if (!coupon)
            throw new common_1.NotFoundException('Invalid coupon code');
        if (!coupon.isActive)
            throw new common_1.BadRequestException('This coupon is no longer active');
        if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
            throw new common_1.BadRequestException('This coupon has expired');
        }
        if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
            throw new common_1.BadRequestException('This coupon has reached its usage limit');
        }
        const amount = Number(subtotal);
        if (coupon.minPurchaseAmount > 0 && Number.isFinite(amount) && amount < coupon.minPurchaseAmount) {
            throw new common_1.BadRequestException(`This coupon requires a minimum purchase of $${coupon.minPurchaseAmount.toFixed(2)}`);
        }
        let discountAmount;
        if (Number.isFinite(amount) && amount > 0) {
            discountAmount =
                coupon.discountType === 'percentage'
                    ? (amount * coupon.discountValue) / 100
                    : coupon.discountValue;
            discountAmount = Math.round(Math.min(discountAmount, amount) * 100) / 100;
        }
        return { ...coupon.toObject(), discountAmount };
    }
    async remove(id) {
        const deleted = await this.couponModel.findByIdAndDelete(id);
        if (!deleted)
            throw new common_1.NotFoundException('Coupon not found');
        return { message: 'Coupon deleted', id };
    }
};
exports.CouponsService = CouponsService;
exports.CouponsService = CouponsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(coupon_schema_1.Coupon.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CouponsService);
//# sourceMappingURL=coupons.service.js.map