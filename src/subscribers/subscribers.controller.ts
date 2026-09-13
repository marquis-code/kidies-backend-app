import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

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
