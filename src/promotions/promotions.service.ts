import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Promotion, PromotionDocument } from './schemas/promotion.schema';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectModel(Promotion.name) private promotionModel: Model<PromotionDocument>,
  ) {}

  async findAll(query: any = {}): Promise<Promotion[]> {
    const filter: any = {};
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

  async findOne(id: string): Promise<Promotion> {
    const promotion = await this.promotionModel.findById(id).exec();
    if (!promotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }
    return promotion;
  }

  async create(createPromotionDto: any): Promise<Promotion> {
    const newPromotion = new this.promotionModel(createPromotionDto);
    return newPromotion.save();
  }

  async update(id: string, updatePromotionDto: any): Promise<Promotion> {
    const updatedPromotion = await this.promotionModel.findByIdAndUpdate(
      id,
      updatePromotionDto,
      { new: true },
    ).exec();
    if (!updatedPromotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }
    return updatedPromotion;
  }

  async remove(id: string): Promise<void> {
    const result = await this.promotionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }
  }
}
