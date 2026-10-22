import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { OrdersService } from './orders.service';
export declare class StripeController {
    private configService;
    private ordersService;
    private readonly logger;
    private stripe;
    private webhookSecret;
    constructor(configService: ConfigService, ordersService: OrdersService);
    handleWebhook(req: any, res: Response, signature: string): Promise<Response<any, Record<string, any>>>;
}
