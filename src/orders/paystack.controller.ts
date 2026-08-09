import { Controller, Post, Req, Res, Headers, HttpCode } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import type { Request, Response } from 'express';
import { Order, OrderDocument } from './schemas/order.schema';

@Controller('webhook/paystack')
export class PaystackController {
  constructor(
    private configService: ConfigService,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>
  ) {}

  @Post()
  @HttpCode(200)
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('x-paystack-signature') signature: string
  ) {
    const secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY') || process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return res.status(400).send('Secret key not configured');
    }

    // Verify signature
    const hash = crypto.createHmac('sha512', secretKey).update(JSON.stringify(req.body)).digest('hex');
    if (hash !== signature) {
      return res.status(400).send('Invalid signature');
    }

    const event = req.body;

    if (event.event === 'charge.success') {
      const reference = event.data.reference;
      // Find the order with this reference
      const order = await this.orderModel.findOne({ paystackReference: reference });
      
      if (order && order.paymentStatus !== 'Paid') {
        order.paymentStatus = 'Paid';
        order.status = 'Processing'; // or whatever status comes after paid
        await order.save();
        console.log(`Order ${order.orderNumber} successfully paid via Paystack`);
      }
    }

    return res.status(200).send('Webhook processed');
  }
}
