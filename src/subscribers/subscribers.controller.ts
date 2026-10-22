import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @UseGuards(JwtGuard, AdminGuard)
  @Get()
  async findAll() {
    return this.subscribersService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSubscriberDto: CreateSubscriberDto) {
    const subscriber = await this.subscribersService.subscribe(createSubscriberDto);
    return {
      message: 'Successfully subscribed to the newsletter',
      subscriber,
    };
  }
}
