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
const category_schema_1 = require("../categories/schemas/category.schema");
let ProductsService = class ProductsService {
    productModel;
    categoryModel;
    constructor(productModel, categoryModel) {
        this.productModel = productModel;
        this.categoryModel = categoryModel;
    }
    escapeRegex(value) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    async resolveCategoryIds(values) {
        const wanted = values.map((v) => v.trim().toLowerCase()).filter(Boolean);
        if (!wanted.length)
            return [];
        const categories = await this.categoryModel.find().select('_id name').lean().exec();
        const ids = [];
        for (const cat of categories) {
            const slug = String(cat.name || '')
                .toLowerCase()
                .replace(/&/g, 'and')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            if (wanted.includes(slug) || wanted.includes(String(cat.name).toLowerCase())) {
                ids.push(cat._id);
            }
        }
        return ids;
    }
    async findAll(query = {}, opts = {}) {
        const filter = {};
        const requestedStatus = (query.status || '').toLowerCase();
        if (opts.includeInactive) {
            if (requestedStatus && requestedStatus !== 'all') {
                filter.status = requestedStatus;
            }
        }
        else {
            filter.status = 'active';
        }
        if (query.category) {
            const values = String(query.category)
                .split(',')
                .map((v) => v.trim())
                .filter(Boolean);
            if (values.length) {
                const categoryIds = await this.resolveCategoryIds(values);
                const normalized = values.map((v) => v.toLowerCase().replace(/-/g, ' '));
                const tagRxs = normalized.map((v) => new RegExp(`^${this.escapeRegex(v)}$`, 'i'));
                const nameRxs = normalized.map((v) => new RegExp(this.escapeRegex(v), 'i'));
                const extra = [
                    { tags: { $in: tagRxs } },
                    { tags: { $in: nameRxs } },
                    { gender: { $in: values.map((v) => v.toLowerCase()) } },
                    { ageGroup: { $in: values.map((v) => v.toLowerCase()) } },
                    { name: { $in: nameRxs } },
                    { productType: { $in: values.map((v) => v.toLowerCase()) } },
                ];
                if (categoryIds.length)
                    extra.push({ categoryId: { $in: categoryIds } });
                filter.$and = [...(filter.$and || []), { $or: extra }];
            }
        }
        if (query.tag) {
            filter.tags = { $in: String(query.tag).split(',').map((t) => t.trim()) };
        }
        if (query.search) {
            const searchRegex = new RegExp(this.escapeRegex(String(query.search).trim()), 'i');
            filter.$and = [
                ...(filter.$and || []),
                {
                    $or: [
                        { name: searchRegex },
                        { description: searchRegex },
                        { tags: searchRegex },
                        { sku: searchRegex },
                    ],
                },
            ];
        }
        if (query.minPrice || query.maxPrice) {
            filter.basePrice = {};
            if (query.minPrice)
                filter.basePrice.$gte = parseFloat(query.minPrice);
            if (query.maxPrice)
                filter.basePrice.$lte = parseFloat(query.maxPrice);
        }
        if (query.gender) {
            const genders = String(query.gender)
                .split(',')
                .map((g) => g.trim().toLowerCase())
                .filter(Boolean);
            if (genders.length)
                filter.gender = { $in: genders };
        }
        if (query.color) {
            const colors = String(query.color)
                .split(',')
                .map((c) => c.trim().toLowerCase())
                .filter(Boolean);
            if (colors.length) {
                const colorRx = new RegExp(colors.map((c) => this.escapeRegex(c)).join('|'), 'i');
                filter.$and = [
                    ...(filter.$and || []),
                    { $or: [{ colors: { $in: colors } }, { 'variants.color': colorRx }] },
                ];
            }
        }
        if (query.size) {
            const sizes = String(query.size)
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);
            if (sizes.length)
                filter['variants.size'] = { $in: sizes };
        }
        if (query.ageGroup) {
            const ageGroups = String(query.ageGroup)
                .split(',')
                .map((a) => a.trim())
                .filter(Boolean);
            if (ageGroups.length)
                filter.ageGroup = { $in: ageGroups };
        }
        if (query.productType) {
            const types = String(query.productType)
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean);
            if (types.length)
                filter.productType = { $in: types };
        }
        if (query.minRating) {
            filter.averageRating = { $gte: parseFloat(query.minRating) };
        }
        if (query.keyFeatures) {
            filter.keyFeatures = {
                $in: String(query.keyFeatures).split(',').map((f) => f.trim()),
            };
        }
        if (query.sustainability) {
            filter.sustainability = {
                $in: String(query.sustainability).split(',').map((s) => s.trim()),
            };
        }
        if (query.featured === 'true') {
            filter['images.isFeatured'] = true;
        }
        let sort = { createdAt: -1 };
        switch (query.sort) {
            case 'price_asc':
                sort = { basePrice: 1 };
                break;
            case 'price_desc':
                sort = { basePrice: -1 };
                break;
            case 'newest':
                sort = { createdAt: -1 };
                break;
            case 'rating':
                sort = { averageRating: -1, reviewCount: -1 };
                break;
            case 'popular':
                sort = { reviewCount: -1, averageRating: -1 };
                break;
            case 'name_asc':
                sort = { name: 1 };
                break;
            default:
                sort = { createdAt: -1 };
        }
        const page = Math.max(1, parseInt(query.page, 10) || 1);
        const limit = Math.min(200, Math.max(1, parseInt(query.limit, 10) || 50));
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
    async findOne(id, includeInactive = false) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        const product = await this.productModel.findById(id).populate('categoryId').exec();
        if (!product || (!includeInactive && product.status !== 'active')) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async findRelated(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            return [];
        const product = await this.productModel.findById(id).populate('relatedProducts').exec();
        if (!product)
            return [];
        let related = product.relatedProducts ? [...product.relatedProducts] : [];
        if (related.length < 6) {
            const relatedIds = related.map((p) => p._id);
            const dynamicRelated = await this.productModel
                .find({
                _id: { $ne: product._id, $nin: relatedIds },
                status: 'active',
                $or: [
                    { tags: { $in: product.tags || [] } },
                    { productType: product.productType },
                    { categoryId: product.categoryId },
                ],
            })
                .limit(12)
                .exec();
            related = [...related, ...dynamicRelated].slice(0, 6);
        }
        return related;
    }
    async create(dto) {
        if (!dto.name || String(dto.name).trim() === '') {
            throw new common_1.BadRequestException('Product name is required');
        }
        const price = Number(dto.basePrice);
        if (!Number.isFinite(price) || price < 0) {
            throw new common_1.BadRequestException('A valid base price is required');
        }
        const payload = { ...dto, basePrice: price };
        payload.sku = (dto.sku && String(dto.sku).trim()) || `SKU-${Date.now().toString(36).toUpperCase()}`;
        payload.status = dto.status || 'draft';
        const existingSku = await this.productModel.findOne({ sku: payload.sku });
        if (existingSku) {
            throw new common_1.ConflictException('A product with this SKU already exists');
        }
        if (payload.status === 'active' && !payload.publishedAt) {
            payload.publishedAt = new Date();
        }
        if (!payload.imageUrls && Array.isArray(payload.images) && payload.images.length) {
            const first = payload.images.find((img) => img?.url);
            if (first) {
                payload.imageUrls = {
                    thumbnail: first.url,
                    medium: first.url,
                    large: first.url,
                    original: first.url,
                };
            }
        }
        const createdProduct = new this.productModel(payload);
        return createdProduct.save();
    }
    async update(id, dto) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        const payload = { ...dto };
        delete payload._id;
        if (payload.basePrice !== undefined) {
            const price = Number(payload.basePrice);
            if (!Number.isFinite(price) || price < 0) {
                throw new common_1.BadRequestException('A valid base price is required');
            }
            payload.basePrice = price;
        }
        if (payload.sku) {
            const duplicate = await this.productModel.findOne({ sku: payload.sku, _id: { $ne: id } });
            if (duplicate)
                throw new common_1.ConflictException('A product with this SKU already exists');
        }
        if (payload.status === 'active') {
            const current = await this.productModel.findById(id).select('publishedAt');
            if (current && !current.publishedAt)
                payload.publishedAt = new Date();
        }
        if (!payload.imageUrls && Array.isArray(payload.images) && payload.images.length) {
            const first = payload.images.find((img) => img?.url);
            if (first) {
                payload.imageUrls = {
                    thumbnail: first.url,
                    medium: first.url,
                    large: first.url,
                    original: first.url,
                };
            }
        }
        const updated = await this.productModel
            .findByIdAndUpdate(id, payload, { new: true })
            .populate('categoryId')
            .exec();
        if (!updated) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return updated;
    }
    async remove(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        const deleted = await this.productModel.findByIdAndDelete(id).exec();
        if (!deleted) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return { message: 'Product deleted successfully', id };
    }
    async getStats() {
        const [total, active, draft, archived] = await Promise.all([
            this.productModel.countDocuments(),
            this.productModel.countDocuments({ status: 'active' }),
            this.productModel.countDocuments({ status: 'draft' }),
            this.productModel.countDocuments({ status: 'archived' }),
        ]);
        const lowStock = await this.productModel.countDocuments({
            status: 'active',
            $expr: {
                $lt: [{ $sum: { $ifNull: ['$variants.stockQuantity', []] } }, 5],
            },
        });
        return { total, active, draft, archived, lowStock };
    }
    async getStock(productId) {
        const product = await this.productModel.findById(productId).select('variants');
        if (!product)
            return 0;
        return (product.variants || []).reduce((sum, v) => sum + (Number(v.stockQuantity) || 0), 0);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(1, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ProductsService);
//# sourceMappingURL=products.service.js.map