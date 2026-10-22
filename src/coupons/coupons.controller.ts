import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @UseGuards(JwtGuard, AdminGuard)
  @Post()
  create(@Body() createCouponDto: any) {
    return this.couponsService.create(createCouponDto);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get()
  findAll() {
    return this.couponsService.findAll();
  }

  @Post('validate')
  validate(@Body('code') code: string, @Body('subtotal') subtotal?: number) {
    return this.couponsService.validate(code, subtotal);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCouponDto: any) {
    return this.couponsService.update(id, updateCouponDto);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.couponsService.remove(id);
  }
}
