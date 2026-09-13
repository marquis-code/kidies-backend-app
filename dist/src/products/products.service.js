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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./schemas/product.schema");
let ProductsService = class ProductsService {
    productModel;
    constructor(productModel) {
        this.productModel = productModel;
    }
    async findAll(query = {}) {
        const filter = { status: 'active' };
        if (query.category) {
            const categorySlug = query.category.toLowerCase().replace(/-/g, ' ');
            filter.$or = [
                { tags: { $regex: new RegExp(categorySlug, 'i') } },
            ];
        }
        if (query.tag) {
            filter.tags = { $in: [query.tag] };
        }
        if (query.search) {
            const searchRegex = new RegExp(query.search, 'i');
            const searchCondition = [
                { name: searchRegex },
                { description: searchRegex },
                { tags: searchRegex },
            ];
            if (filter.$or) {
                filter.$and = [{ $or: filter.$or }, { $or: searchCondition }];
                delete filter.$or;
            }
            else {
                filter.$or = searchCondition;
            }
        }
        if (query.minPrice || query.maxPrice) {
            filter.basePrice = {};
            if (query.minPrice)
                filter.basePrice.$gte = parseFloat(query.minPrice);
            if (query.maxPrice)
                filter.basePrice.$lte = parseFloat(query.maxPrice);
        }
        if (query.gender) {
            const genders = query.gender.split(',').map((g) => g.trim().toLowerCase());
            filter.gender = { $in: genders };
        }
        if (query.color) {
            const colors = query.color.split(',').map((c) => c.trim().toLowerCase());
            filter.$or = filter.$or || [];
            const colorCondition = {
                $or: [
                    { colors: { $in: colors } },
                    { 'variants.color': { $regex: new RegExp(colors.join('|'), 'i') } },
                ],
            };
            if (filter.$and) {
                filter.$and.push(colorCondition);
            }
            else if (filter.$or && filter.$or.length > 0) {
                filter.$and = [{ $or: filter.$or }, colorCondition];
                delete filter.$or;
            }
            else {
                filter.$or = colorCondition.$or;
            }
        }
        if (query.size) {
            const sizes = query.size.split(',').map((s) => s.trim());
            filter['variants.size'] = { $in: sizes };
        }
        if (query.ageGroup) {
            const ageGroups = query.ageGroup.split(',').map((a) => a.trim());
            filter.ageGroup = { $in: ageGroups };
        }
        if (query.productType) {
            const types = query.productType.split(',').map((t) => t.trim());
            filter.productType = { $in: types };
        }
        if (query.minRating) {
            filter.averageRating = { $gte: parseFloat(query.minRating) };
        }
        if (query.keyFeatures) {
            const features = query.keyFeatures.split(',').map((f) => f.trim());
            filter.keyFeatures = { $in: features };
        }
        if (query.sustainability) {
            const sust = query.sustainability.split(',').map((s) => s.trim());
            filter.sustainability = { $in: sust };
        }
        let sort = { publishedAt: -1 };
        if (query.sort === 'price_asc')
            sort = { basePrice: 1 };
        else if (query.sort === 'price_desc')
            sort = { basePrice: -1 };
        else if (query.sort === 'newest')
            sort = { createdAt: -1 };
        else if (query.sort === 'rating')
            sort = { averageRating: -1 };
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 50;
        const skip = (page - 1) * limit;
        const [products, total] = await Promise.all([
            this.productModel
                .find(filter)
                .populate('categoryId')
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec(),
            this.productModel.countDocuments(filter),
        ]);
        return { products, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const product = await this.productModel.findById(id).populate('categoryId').exec();
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async findRelated(id) {
        const product = await this.productModel.findById(id).populate('relatedProducts').exec();
        if (!product)
            return [];
        let related = [];
        if (product.relatedProducts && product.relatedProducts.length > 0) {
            related = [...product.relatedProducts];
        }
        if (related.length < 6) {
            const relatedIds = related.map((p) => p._id);
            const dynamicRelated = await this.productModel.find({
                _id: { $ne: id, $nin: relatedIds },
                status: 'active',
                tags: { $in: product.tags || [] },
            }).limit(6 - related.length).exec();
            related = [...related, ...dynamicRelated];
        }
        return related;
    }
    async create(createProductDto) {
        const createdProduct = new this.productModel(createProductDto);
        return createdProduct.save();
    }
    async update(id, updateProductDto) {
        const updated = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
        if (!updated) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return updated;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProductsService);
//# sourceMappingURL=products.service.js.map