import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
export declare class SubscribersController {
    private readonly subscribersService;
    constructor(subscribersService: SubscribersService);
    create(createSubscriberDto: CreateSubscriberDto): Promise<{
        message: string;
        subscriber: import("./schemas/subscriber.schema").Subscriber;
    }>;
}
