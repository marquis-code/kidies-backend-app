import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { OptionalJwtGuard } from '../auth/optional-jwt.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(OptionalJwtGuard)
  @Get()
  findAll(@Query() query: any, @Req() req: any) {
    const includeInactive =
      (query.includeInactive === 'true' || query.status === 'all') &&
      req.user?.role === 'admin';
    return this.productsService.findAll(query, { includeInactive });
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get('admin/stats')
  getStats() {
    return this.productsService.getStats();
  }

  @UseGuards(OptionalJwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.productsService.findOne(id, req.user?.role === 'admin');
  }

  @Get(':id/related')
  findRelated(@Param('id') id: string) {
    return this.productsService.findRelated(id);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Post()
  create(@Body() createProductDto: any) {
    return this.productsService.create(createProductDto);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: any) {
    return this.productsService.update(id, updateProductDto);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
