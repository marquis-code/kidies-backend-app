import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAll(query: any = {}): Promise<any> {
    const filter: any = { status: 'active' };

    // Filter by category name (slug-style, e.g. "boy", "girl", "baby")
    if (query.category) {
      const categorySlug = query.category.toLowerCase().replace(/-/g, ' ');
      filter.$or = [
        { tags: { $regex: new RegExp(categorySlug, 'i') } },
      ];
    }

    // Filter by tag
    if (query.tag) {
      filter.tags = { $in: [query.tag] };
    }

    // Search by name or description
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
      } else {
        filter.$or = searchCondition;
      }
    }

    // Price range filter
    if (query.minPrice || query.maxPrice) {
      filter.basePrice = {};
      if (query.minPrice) filter.basePrice.$gte = parseFloat(query.minPrice);
      if (query.maxPrice) filter.basePrice.$lte = parseFloat(query.maxPrice);
    }

    // Gender filter (comma-separated)
    if (query.gender) {
      const genders = query.gender.split(',').map((g: string) => g.trim().toLowerCase());
      filter.gender = { $in: genders };
    }

    // Color filter (comma-separated) - search both `colors` field and variant colors
    if (query.color) {
      const colors = query.color.split(',').map((c: string) => c.trim().toLowerCase());
      filter.$or = filter.$or || [];
      const colorCondition = {
        $or: [
          { colors: { $in: colors } },
          { 'variants.color': { $regex: new RegExp(colors.join('|'), 'i') } },
        ],
      };
      if (filter.$and) {
        filter.$and.push(colorCondition);
      } else if (filter.$or && filter.$or.length > 0) {
        filter.$and = [{ $or: filter.$or }, colorCondition];
        delete filter.$or;
      } else {
        filter.$or = colorCondition.$or;
      }
    }

    // Size filter (comma-separated) – searches in variants
    if (query.size) {
      const sizes = query.size.split(',').map((s: string) => s.trim());
      filter['variants.size'] = { $in: sizes };
    }

    // Age group filter
    if (query.ageGroup) {
      const ageGroups = query.ageGroup.split(',').map((a: string) => a.trim());
      filter.ageGroup = { $in: ageGroups };
    }

    // Product type filter (comma-separated)
    if (query.productType) {
      const types = query.productType.split(',').map((t: string) => t.trim());
      filter.productType = { $in: types };
    }

    // Rating filter (minimum)
    if (query.minRating) {
      filter.averageRating = { $gte: parseFloat(query.minRating) };
    }

    // Key features filter
    if (query.keyFeatures) {
      const features = query.keyFeatures.split(',').map((f: string) => f.trim());
      filter.keyFeatures = { $in: features };
    }

    // Sustainability filter
    if (query.sustainability) {
      const sust = query.sustainability.split(',').map((s: string) => s.trim());
      filter.sustainability = { $in: sust };
    }

    // Build sort
    let sort: any = { publishedAt: -1 };
    if (query.sort === 'price_asc') sort = { basePrice: 1 };
    else if (query.sort === 'price_desc') sort = { basePrice: -1 };
    else if (query.sort === 'newest') sort = { createdAt: -1 };
    else if (query.sort === 'rating') sort = { averageRating: -1 };

    // Pagination
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

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).populate('categoryId').exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async findRelated(id: string): Promise<Product[]> {
    const product = await this.productModel.findById(id).populate('relatedProducts').exec();
    if (!product) return [];
    
    let related: any[] = [];
    if (product.relatedProducts && product.relatedProducts.length > 0) {
      related = [...product.relatedProducts];
    }
    
    if (related.length < 6) {
      const relatedIds = related.map((p: any) => p._id);
      const dynamicRelated = await this.productModel.find({
        _id: { $ne: id, $nin: relatedIds },
        status: 'active',
        tags: { $in: product.tags || [] },
      }).limit(6 - related.length).exec();
      related = [...related, ...dynamicRelated];
    }
    
    return related;
  }

  async create(createProductDto: any): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async update(id: string, updateProductDto: any): Promise<Product> {
    const updated = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updated;
  }
}
