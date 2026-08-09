import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductPoliciesService } from './product-policies.service';
import { ProductPoliciesController } from './product-policies.controller';
import { ProductPolicy, ProductPolicySchema } from './schemas/product-policy.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ProductPolicy.name, schema: ProductPolicySchema }])],
  controllers: [ProductPoliciesController],
  providers: [ProductPoliciesService],
  exports: [ProductPoliciesService],
})
export class ProductPoliciesModule {}
