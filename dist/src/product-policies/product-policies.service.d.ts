import { Model } from 'mongoose';
import { CreateProductPolicyDto } from './dto/create-product-policy.dto';
import { UpdateProductPolicyDto } from './dto/update-product-policy.dto';
import { ProductPolicy, ProductPolicyDocument } from './schemas/product-policy.schema';
export declare class ProductPoliciesService {
    private policyModel;
    constructor(policyModel: Model<ProductPolicyDocument>);
    create(createProductPolicyDto: CreateProductPolicyDto): Promise<ProductPolicy>;
    findAll(): Promise<ProductPolicy[]>;
    findOne(id: string): Promise<ProductPolicy>;
    update(id: string, updateProductPolicyDto: UpdateProductPolicyDto): Promise<ProductPolicy>;
    remove(id: string): Promise<any>;
}
