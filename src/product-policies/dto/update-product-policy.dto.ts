import { PartialType } from '@nestjs/mapped-types';
import { CreateProductPolicyDto } from './create-product-policy.dto';

export class UpdateProductPolicyDto extends PartialType(CreateProductPolicyDto) {}
