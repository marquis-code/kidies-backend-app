import { ProductPoliciesService } from './product-policies.service';
import { CreateProductPolicyDto } from './dto/create-product-policy.dto';
import { UpdateProductPolicyDto } from './dto/update-product-policy.dto';
export declare class ProductPoliciesController {
    private readonly productPoliciesService;
    constructor(productPoliciesService: ProductPoliciesService);
    create(createProductPolicyDto: CreateProductPolicyDto): Promise<import("./schemas/product-policy.schema").ProductPolicy>;
    findAll(): Promise<import("./schemas/product-policy.schema").ProductPolicy[]>;
    findOne(id: string): Promise<import("./schemas/product-policy.schema").ProductPolicy>;
    update(id: string, updateProductPolicyDto: UpdateProductPolicyDto): Promise<import("./schemas/product-policy.schema").ProductPolicy>;
    remove(id: string): Promise<any>;
}
