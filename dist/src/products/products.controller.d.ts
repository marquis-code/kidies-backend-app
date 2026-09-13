import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(query: any): Promise<any>;
    findOne(id: string): Promise<import("./schemas/product.schema").Product>;
    findRelated(id: string): Promise<import("./schemas/product.schema").Product[]>;
    create(createProductDto: any): Promise<import("./schemas/product.schema").Product>;
    update(id: string, updateProductDto: any): Promise<import("./schemas/product.schema").Product>;
}
