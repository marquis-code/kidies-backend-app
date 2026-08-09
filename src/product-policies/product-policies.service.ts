import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductPolicyDto } from './dto/create-product-policy.dto';
import { UpdateProductPolicyDto } from './dto/update-product-policy.dto';
import { ProductPolicy, ProductPolicyDocument } from './schemas/product-policy.schema';

@Injectable()
export class ProductPoliciesService {
  constructor(@InjectModel(ProductPolicy.name) private policyModel: Model<ProductPolicyDocument>) {}

  async create(createProductPolicyDto: CreateProductPolicyDto): Promise<ProductPolicy> {
    const createdPolicy = new this.policyModel(createProductPolicyDto);
    return createdPolicy.save();
  }

  async findAll(): Promise<ProductPolicy[]> {
    return this.policyModel.find().exec();
  }

  async findOne(id: string): Promise<ProductPolicy> {
    const policy = await this.policyModel.findById(id).exec();
    if (!policy) {
      throw new NotFoundException(`ProductPolicy #${id} not found`);
    }
    return policy;
  }

  async update(id: string, updateProductPolicyDto: UpdateProductPolicyDto): Promise<ProductPolicy> {
    const existingPolicy = await this.policyModel.findByIdAndUpdate(id, updateProductPolicyDto, { new: true }).exec();
    if (!existingPolicy) {
      throw new NotFoundException(`ProductPolicy #${id} not found`);
    }
    return existingPolicy;
  }

  async remove(id: string): Promise<any> {
    const deletedPolicy = await this.policyModel.findByIdAndDelete(id).exec();
    if (!deletedPolicy) {
      throw new NotFoundException(`ProductPolicy #${id} not found`);
    }
    return deletedPolicy;
  }
}
