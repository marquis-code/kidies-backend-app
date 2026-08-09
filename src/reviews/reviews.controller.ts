import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Request() req: any, @Body() createReviewDto: { productId: string; rating: number; comment: string }) {
    return this.reviewsService.create(req.user.userId, createReviewDto.productId, createReviewDto.rating, createReviewDto.comment);
  }

  @Get('product/:id')
  findByProduct(@Param('id') id: string) {
    return this.reviewsService.findByProduct(id);
  }
}
