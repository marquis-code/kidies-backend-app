import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductPoliciesService } from './product-policies.service';
import { CreateProductPolicyDto } from './dto/create-product-policy.dto';
import { UpdateProductPolicyDto } from './dto/update-product-policy.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('product-policies')
export class ProductPoliciesController {
  constructor(private readonly productPoliciesService: ProductPoliciesService) {}

  @UseGuards(JwtGuard, AdminGuard)
  @Post()
  create(@Body() createProductPolicyDto: CreateProductPolicyDto) {
    return this.productPoliciesService.create(createProductPolicyDto);
  }

  @Get()
  findAll() {
    return this.productPoliciesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productPoliciesService.findOne(id);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductPolicyDto: UpdateProductPolicyDto) {
    return this.productPoliciesService.update(id, updateProductPolicyDto);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productPoliciesService.remove(id);
  }
}
