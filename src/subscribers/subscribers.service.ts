import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscriber, SubscriberDocument } from './schemas/subscriber.schema';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subscriber.name) private subscriberModel: Model<SubscriberDocument>,
  ) {}

  async findAll(): Promise<Subscriber[]> {
    return this.subscriberModel.find().sort({ createdAt: -1 }).exec();
  }

  async subscribe(createSubscriberDto: CreateSubscriberDto): Promise<Subscriber> {
    const existingSubscriber = await this.subscriberModel.findOne({ email: createSubscriberDto.email.toLowerCase() });
    
    if (existingSubscriber) {
      // Return the existing one silently to not expose subscribers or handle nicely on frontend
      return existingSubscriber;
    }

    const createdSubscriber = new this.subscriberModel(createSubscriberDto);
    return createdSubscriber.save();
  }
}
