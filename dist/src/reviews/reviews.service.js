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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const review_schema_1 = require("./schemas/review.schema");
const product_schema_1 = require("../products/schemas/product.schema");
let ReviewsService = class ReviewsService {
    reviewModel;
    productModel;
    constructor(reviewModel, productModel) {
        this.reviewModel = reviewModel;
        this.productModel = productModel;
    }
    async create(userId, productId, rating, comment) {
        if (!userId || !mongoose_2.Types.ObjectId.isValid(userId)) {
            throw new common_1.BadRequestException('User not found');
        }
        if (!productId || !mongoose_2.Types.ObjectId.isValid(productId)) {
            throw new common_1.NotFoundException('Product not found');
        }
        const numericRating = Number(rating);
        if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
            throw new common_1.BadRequestException('Rating must be between 1 and 5');
        }
        if (!comment || !String(comment).trim()) {
            throw new common_1.BadRequestException('Please add a short review comment');
        }
        const product = await this.productModel.findById(productId);
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const existing = await this.reviewModel.findOne({
            productId: new mongoose_2.Types.ObjectId(productId),
            userId: new mongoose_2.Types.ObjectId(userId),
        });
        if (existing) {
            existing.rating = numericRating;
            existing.comment = String(comment).trim();
            await existing.save();
            await this.recalculateProduct(productId);
            return existing.populate('userId', 'firstName lastName');
        }
        const review = new this.reviewModel({
            userId: new mongoose_2.Types.ObjectId(userId),
            productId: new mongoose_2.Types.ObjectId(productId),
            rating: numericRating,
            comment: String(comment).trim(),
        });
        const savedReview = await review.save();
        await this.recalculateProduct(productId);
        return savedReview.populate('userId', 'firstName lastName');
    }
    async recalculateProduct(productId) {
        const allReviews = await this.reviewModel.find({ productId: new mongoose_2.Types.ObjectId(productId) });
        const reviewCount = allReviews.length;
        const averageRating = reviewCount > 0
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
    async remove(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.NotFoundException('Review not found');
        const review = await this.reviewModel.findByIdAndDelete(id);
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        await this.recalculateProduct(String(review.productId));
        return { message: 'Review deleted', id };
    }
    async findByProduct(productId) {
        if (!productId || !mongoose_2.Types.ObjectId.isValid(productId))
            return [];
        return this.reviewModel.find({ productId: new mongoose_2.Types.ObjectId(productId) })
            .populate('userId', 'firstName lastName')
            .sort({ createdAt: -1 })
            .exec();
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map