import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
export declare class ProductsService {
    private productModel;
    constructor(productModel: Model<ProductDocument>);
    findAll(query?: any): Promise<any>;
    findOne(id: string): Promise<Product>;
    findRelated(id: string): Promise<Product[]>;
    create(createProductDto: any): Promise<Product>;
    update(id: string, updateProductDto: any): Promise<Product>;
}
