import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Category, CategoryDocument } from '../categories/schemas/category.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  private escapeRegex(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /** Resolve slugs such as "back-to-school" or "boy" to category ids. */
  private async resolveCategoryIds(values: string[]): Promise<Types.ObjectId[]> {
    const wanted = values.map((v) => v.trim().toLowerCase()).filter(Boolean);
    if (!wanted.length) return [];
    const categories = await this.categoryModel.find().select('_id name').lean().exec();
    const ids: Types.ObjectId[] = [];
    for (const cat of categories) {
      const slug = String(cat.name || '')
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      if (wanted.includes(slug) || wanted.includes(String(cat.name).toLowerCase())) {
        ids.push(cat._id as Types.ObjectId);
      }
    }
    return ids;
  }

  async findAll(query: any = {}, opts: { includeInactive?: boolean } = {}): Promise<any> {
    const filter: any = {};

    // ----- status -----
    const requestedStatus = (query.status || '').toLowerCase();
    if (opts.includeInactive) {
      if (requestedStatus && requestedStatus !== 'all') {
        filter.status = requestedStatus;
      }
    } else {
      filter.status = 'active';
    }

    // ----- category (matches category name, tags, gender or age group) -----
    if (query.category) {
      const values = String(query.category)
        .split(',')
        .map((v: string) => v.trim())
        .filter(Boolean);
      if (values.length) {
        const categoryIds = await this.resolveCategoryIds(values);
        const normalized = values.map((v: string) => v.toLowerCase().replace(/-/g, ' '));
        const tagRxs = normalized.map((v: string) => new RegExp(`^${this.escapeRegex(v)}$`, 'i'));
        const nameRxs = normalized.map((v: string) => new RegExp(this.escapeRegex(v), 'i'));
        const extra: any[] = [
          { tags: { $in: tagRxs } },
          { tags: { $in: nameRxs } },
          { gender: { $in: values.map((v: string) => v.toLowerCase()) } },
          { ageGroup: { $in: values.map((v: string) => v.toLowerCase()) } },
          { name: { $in: nameRxs } },
          { productType: { $in: values.map((v: string) => v.toLowerCase()) } },
        ];
        if (categoryIds.length) extra.push({ categoryId: { $in: categoryIds } });
        filter.$and = [...(filter.$and || []), { $or: extra }];
      }
    }

    if (query.tag) {
      filter.tags = { $in: String(query.tag).split(',').map((t: string) => t.trim()) };
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
      if (query.minPrice) filter.basePrice.$gte = parseFloat(query.minPrice);
      if (query.maxPrice) filter.basePrice.$lte = parseFloat(query.maxPrice);
    }

    if (query.gender) {
      const genders = String(query.gender)
        .split(',')
        .map((g: string) => g.trim().toLowerCase())
        .filter(Boolean);
      if (genders.length) filter.gender = { $in: genders };
    }

    if (query.color) {
      const colors = String(query.color)
        .split(',')
        .map((c: string) => c.trim().toLowerCase())
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
        .map((s: string) => s.trim())
        .filter(Boolean);
      if (sizes.length) filter['variants.size'] = { $in: sizes };
    }

    if (query.ageGroup) {
      const ageGroups = String(query.ageGroup)
        .split(',')
        .map((a: string) => a.trim())
        .filter(Boolean);
      if (ageGroups.length) filter.ageGroup = { $in: ageGroups };
    }

    if (query.productType) {
      const types = String(query.productType)
        .split(',')
        .map((t: string) => t.trim())
        .filter(Boolean);
      if (types.length) filter.productType = { $in: types };
    }

    if (query.minRating) {
      filter.averageRating = { $gte: parseFloat(query.minRating) };
    }

    if (query.keyFeatures) {
      filter.keyFeatures = {
        $in: String(query.keyFeatures).split(',').map((f: string) => f.trim()),
      };
    }

    if (query.sustainability) {
      filter.sustainability = {
        $in: String(query.sustainability).split(',').map((s: string) => s.trim()),
      };
    }

    if (query.featured === 'true') {
      filter['images.isFeatured'] = true;
    }

    // ----- sort -----
    let sort: any = { createdAt: -1 };
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

    // ----- pagination -----
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

  async findOne(id: string, includeInactive = false): Promise<Product> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    const product = await this.productModel.findById(id).populate('categoryId').exec();
    if (!product || (!includeInactive && product.status !== 'active')) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async findRelated(id: string): Promise<Product[]> {
    if (!Types.ObjectId.isValid(id)) return [];
    const product = await this.productModel.findById(id).populate('relatedProducts').exec();
    if (!product) return [];

    let related: any[] = product.relatedProducts ? [...(product.relatedProducts as any[])] : [];

    if (related.length < 6) {
      const relatedIds = related.map((p: any) => p._id);
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

  async create(dto: any): Promise<Product> {
    if (!dto.name || String(dto.name).trim() === '') {
      throw new BadRequestException('Product name is required');
    }
    const price = Number(dto.basePrice);
    if (!Number.isFinite(price) || price < 0) {
      throw new BadRequestException('A valid base price is required');
    }

    const payload: any = { ...dto, basePrice: price };
    payload.sku = (dto.sku && String(dto.sku).trim()) || `SKU-${Date.now().toString(36).toUpperCase()}`;
    payload.status = dto.status || 'draft';

    const existingSku = await this.productModel.findOne({ sku: payload.sku });
    if (existingSku) {
      throw new ConflictException('A product with this SKU already exists');
    }

    if (payload.status === 'active' && !payload.publishedAt) {
      payload.publishedAt = new Date();
    }

    if (!payload.imageUrls && Array.isArray(payload.images) && payload.images.length) {
      const first = payload.images.find((img: any) => img?.url);
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

  async update(id: string, dto: any): Promise<Product> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    const payload: any = { ...dto };
    delete payload._id;

    if (payload.basePrice !== undefined) {
      const price = Number(payload.basePrice);
      if (!Number.isFinite(price) || price < 0) {
        throw new BadRequestException('A valid base price is required');
      }
      payload.basePrice = price;
    }

    if (payload.sku) {
      const duplicate = await this.productModel.findOne({ sku: payload.sku, _id: { $ne: id } });
      if (duplicate) throw new ConflictException('A product with this SKU already exists');
    }

    if (payload.status === 'active') {
      const current = await this.productModel.findById(id).select('publishedAt');
      if (current && !current.publishedAt) payload.publishedAt = new Date();
    }

    if (!payload.imageUrls && Array.isArray(payload.images) && payload.images.length) {
      const first = payload.images.find((img: any) => img?.url);
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
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<any> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    const deleted = await this.productModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return { message: 'Product deleted successfully', id };
  }

  async getStats(): Promise<any> {
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

  /** Returns the total available stock for a product across variants. */
  async getStock(productId: string): Promise<number> {
    const product = await this.productModel.findById(productId).select('variants');
    if (!product) return 0;
    return (product.variants || []).reduce(
      (sum: number, v: any) => sum + (Number(v.stockQuantity) || 0),
      0,
    );
  }
}
