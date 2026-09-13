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
        data.code = data.code.toUpperCase();
        const existing = await this.couponModel.findOne({ code: data.code });
        if (existing)
            throw new common_1.BadRequestException('Coupon code already exists');
        return this.couponModel.create(data);
    }
    async findAll() {
        return this.couponModel.find().sort({ createdAt: -1 }).exec();
    }
    async validate(code) {
        const coupon = await this.couponModel.findOne({ code: code.toUpperCase() });
        if (!coupon)
            throw new common_1.NotFoundException('Invalid coupon code');
        if (!coupon.isActive)
            throw new common_1.BadRequestException('This coupon is no longer active');
        if (coupon.expiryDate && new Date() > coupon.expiryDate) {
            throw new common_1.BadRequestException('This coupon has expired');
        }
        return coupon;
    }
    async remove(id) {
        return this.couponModel.findByIdAndDelete(id);
    }
};
exports.CouponsService = CouponsService;
exports.CouponsService = CouponsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(coupon_schema_1.Coupon.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CouponsService);
//# sourceMappingURL=coupons.service.js.map