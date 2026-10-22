import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(userId: string, productId: string, rating: number, comment: string) {
    if (!userId || !Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('User not found');
    }
    if (!productId || !Types.ObjectId.isValid(productId)) {
      throw new NotFoundException('Product not found');
    }
    const numericRating = Number(rating);
    if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }
    if (!comment || !String(comment).trim()) {
      throw new BadRequestException('Please add a short review comment');
    }

    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existing = await this.reviewModel.findOne({
      productId: new Types.ObjectId(productId),
      userId: new Types.ObjectId(userId),
    });
    if (existing) {
      existing.rating = numericRating;
      existing.comment = String(comment).trim();
      await existing.save();
      await this.recalculateProduct(productId);
      return existing.populate('userId', 'firstName lastName');
    }

    const review = new this.reviewModel({
      userId: new Types.ObjectId(userId),
      productId: new Types.ObjectId(productId),
      rating: numericRating,
      comment: String(comment).trim(),
    });

    const savedReview = await review.save();
    await this.recalculateProduct(productId);
    return savedReview.populate('userId', 'firstName lastName');
  }

  private async recalculateProduct(productId: string) {
    const allReviews = await this.reviewModel.find({ productId: new Types.ObjectId(productId) });
    const reviewCount = allReviews.length;
    const averageRating =
      reviewCount > 0
        ? Math.round((allReviews.reduce((acc, curr) => acc + curr.rating, 0) / reviewCount) * 10) / 10
        : 0;
    await this.productModel.findByIdAndUpdate(productId, { reviewCount, averageRating });
  }

  async findAll() {
    return this.reviewModel
      .find()
      .populate('userId', 'firstName lastName email')
      .populate('productId', 'name sku')
      .sort({ createdAt: -1 })
      .exec();
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Review not found');
    const review = await this.reviewModel.findByIdAndDelete(id);
    if (!review) throw new NotFoundException('Review not found');
    await this.recalculateProduct(String(review.productId));
    return { message: 'Review deleted', id };
  }

  async findByProduct(productId: string) {
    if (!productId || !Types.ObjectId.isValid(productId)) return [];
    return this.reviewModel.find({ productId: new Types.ObjectId(productId) })
      .populate('userId', 'firstName lastName') // Assuming User schema has these
      .sort({ createdAt: -1 })
      .exec();
  }
}
