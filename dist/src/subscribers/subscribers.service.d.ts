import { Model } from 'mongoose';
import { Subscriber, SubscriberDocument } from './schemas/subscriber.schema';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
export declare class SubscribersService {
    private subscriberModel;
    constructor(subscriberModel: Model<SubscriberDocument>);
    findAll(): Promise<Subscriber[]>;
    subscribe(createSubscriberDto: CreateSubscriberDto): Promise<Subscriber>;
}
