import { Injectable, NotFoundException } from '@nestjs/common';
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
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const review = new this.reviewModel({
      userId: new Types.ObjectId(userId),
      productId: new Types.ObjectId(productId),
      rating,
      comment,
    });

    const savedReview = await review.save();

    // Update product ratings
    const allReviews = await this.reviewModel.find({ productId: new Types.ObjectId(productId) });
    const reviewCount = allReviews.length;
    const averageRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / reviewCount;

    product.reviewCount = reviewCount;
    product.averageRating = averageRating;
    await product.save();

    return savedReview;
  }

  async findByProduct(productId: string) {
    return this.reviewModel.find({ productId: new Types.ObjectId(productId) })
      .populate('userId', 'firstName lastName') // Assuming User schema has these
      .sort({ createdAt: -1 })
      .exec();
  }
}
