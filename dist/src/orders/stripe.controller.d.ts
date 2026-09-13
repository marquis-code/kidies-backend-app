import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import type { Request, Response } from 'express';
import { OrderDocument } from './schemas/order.schema';
export declare class StripeController {
    private configService;
    private orderModel;
    private stripe;
    private webhookSecret;
    constructor(configService: ConfigService, orderModel: Model<OrderDocument>);
    handleWebhook(req: Request, res: Response, signature: string): Promise<Response<any, Record<string, any>>>;
}
