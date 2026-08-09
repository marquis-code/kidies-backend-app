import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon } from './coupon.schema';

@Injectable()
export class CouponsService {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<Coupon>) {}

  async create(data: any): Promise<Coupon> {
    data.code = data.code.toUpperCase();
    const existing = await this.couponModel.findOne({ code: data.code });
    if (existing) throw new BadRequestException('Coupon code already exists');
    return this.couponModel.create(data);
  }

  async findAll(): Promise<Coupon[]> {
    return this.couponModel.find().sort({ createdAt: -1 }).exec();
  }

  async validate(code: string): Promise<Coupon> {
    const coupon = await this.couponModel.findOne({ code: code.toUpperCase() });
    if (!coupon) throw new NotFoundException('Invalid coupon code');
    if (!coupon.isActive) throw new BadRequestException('This coupon is no longer active');
    if (coupon.expiryDate && new Date() > coupon.expiryDate) {
      throw new BadRequestException('This coupon has expired');
    }
    return coupon;
  }

  async remove(id: string): Promise<any> {
    return this.couponModel.findByIdAndDelete(id);
  }
}
