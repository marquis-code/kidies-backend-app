import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CategoryDocument } from '../categories/schemas/category.schema';
export declare class ProductsService {
    private productModel;
    private categoryModel;
    constructor(productModel: Model<ProductDocument>, categoryModel: Model<CategoryDocument>);
    private escapeRegex;
    private resolveCategoryIds;
    findAll(query?: any, opts?: {
        includeInactive?: boolean;
    }): Promise<any>;
    findOne(id: string, includeInactive?: boolean): Promise<Product>;
    findRelated(id: string): Promise<Product[]>;
    create(dto: any): Promise<Product>;
    update(id: string, dto: any): Promise<Product>;
    remove(id: string): Promise<any>;
    getStats(): Promise<any>;
    getStock(productId: string): Promise<number>;
}
