import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Req() req: any,
    @Body() createReviewDto: { productId: string; rating: number; comment: string },
  ) {
    const userId = req.user?.sub || req.user?._id || req.user?.id;
    return this.reviewsService.create(
      userId,
      createReviewDto.productId,
      createReviewDto.rating,
      createReviewDto.comment,
    );
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get('product/:id')
  findByProduct(@Param('id') id: string) {
    return this.reviewsService.findByProduct(id);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }

  @Get(':id')
  findByProductIdAlias(@Param('id') id: string) {
    return this.reviewsService.findByProduct(id);
  }
}
