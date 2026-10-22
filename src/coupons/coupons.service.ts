import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon } from './coupon.schema';

@Injectable()
export class CouponsService {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<Coupon>) {}

  async create(data: any): Promise<Coupon> {
    if (!data?.code) throw new BadRequestException('Coupon code is required');
    const code = String(data.code).toUpperCase().trim();
    const existing = await this.couponModel.findOne({ code });
    if (existing) throw new BadRequestException('Coupon code already exists');

    const discountType = data.discountType || 'percentage';
    const discountValue = Number(data.discountValue);
    if (!['percentage', 'fixed'].includes(discountType)) {
      throw new BadRequestException('Discount type must be percentage or fixed');
    }
    if (!Number.isFinite(discountValue) || discountValue <= 0) {
      throw new BadRequestException('Discount value must be greater than zero');
    }
    if (discountType === 'percentage' && discountValue > 100) {
      throw new BadRequestException('Percentage discount cannot exceed 100');
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

  async findAll(): Promise<Coupon[]> {
    return this.couponModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Coupon> {
    const coupon = await this.couponModel.findById(id);
    if (!coupon) throw new NotFoundException('Coupon not found');
    return coupon;
  }

  async update(id: string, data: any): Promise<Coupon> {
    const payload: any = { ...data };
    delete payload._id;
    delete payload.usedCount;
    if (payload.code) {
      payload.code = String(payload.code).toUpperCase().trim();
      const duplicate = await this.couponModel.findOne({ code: payload.code, _id: { $ne: id } });
      if (duplicate) throw new BadRequestException('Coupon code already exists');
    }
    if (payload.isActive !== undefined) {
      payload.isActive = !(payload.isActive === false || payload.isActive === 'false' || payload.isActive === 0);
    }
    if (payload.discountValue !== undefined) {
      const value = Number(payload.discountValue);
      if (!Number.isFinite(value) || value <= 0) {
        throw new BadRequestException('Discount value must be greater than zero');
      }
      payload.discountValue = value;
    }
    const updated = await this.couponModel.findByIdAndUpdate(id, payload, { new: true });
    if (!updated) throw new NotFoundException('Coupon not found');
    return updated;
  }

  async validate(code: string, subtotal?: number): Promise<any> {
    if (!code) throw new BadRequestException('Coupon code is required');
    const coupon = await this.couponModel.findOne({ code: String(code).toUpperCase().trim() });
    if (!coupon) throw new NotFoundException('Invalid coupon code');
    if (!coupon.isActive) throw new BadRequestException('This coupon is no longer active');
    if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
      throw new BadRequestException('This coupon has expired');
    }
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('This coupon has reached its usage limit');
    }

    const amount = Number(subtotal);
    if (coupon.minPurchaseAmount > 0 && Number.isFinite(amount) && amount < coupon.minPurchaseAmount) {
      throw new BadRequestException(
        `This coupon requires a minimum purchase of $${coupon.minPurchaseAmount.toFixed(2)}`,
      );
    }

    let discountAmount: number | undefined;
    if (Number.isFinite(amount) && amount > 0) {
      discountAmount =
        coupon.discountType === 'percentage'
          ? (amount * coupon.discountValue) / 100
          : coupon.discountValue;
      discountAmount = Math.round(Math.min(discountAmount, amount) * 100) / 100;
    }

    return { ...coupon.toObject(), discountAmount };
  }

  async remove(id: string): Promise<any> {
    const deleted = await this.couponModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Coupon not found');
    return { message: 'Coupon deleted', id };
  }
}
