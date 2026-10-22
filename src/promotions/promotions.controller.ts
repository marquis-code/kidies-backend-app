import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.promotionsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promotionsService.findOne(id);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Post()
  create(@Body() createPromotionDto: any) {
    return this.promotionsService.create(createPromotionDto);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updatePromotionDto: any) {
    return this.promotionsService.update(id, updatePromotionDto);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promotionsService.remove(id);
  }
}
