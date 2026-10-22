import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { OrdersService } from './orders.service';
export declare class PaystackController {
    private configService;
    private ordersService;
    private readonly logger;
    constructor(configService: ConfigService, ordersService: OrdersService);
    handleWebhook(req: any, res: Response, signature: string): Promise<Response<any, Record<string, any>>>;
}
