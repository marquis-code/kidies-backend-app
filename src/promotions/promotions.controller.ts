import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { PromotionsService } from './promotions.service';

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

  @Post()
  create(@Body() createPromotionDto: any) {
    return this.promotionsService.create(createPromotionDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePromotionDto: any) {
    return this.promotionsService.update(id, updatePromotionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promotionsService.remove(id);
  }
}
