import { Controller, Post, Req, Res, Headers, HttpCode, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import type { Request, Response } from 'express';
import { OrdersService } from './orders.service';

@Controller('webhook/paystack')
export class PaystackController {
  private readonly logger = new Logger(PaystackController.name);

  constructor(
    private configService: ConfigService,
    private ordersService: OrdersService,
  ) {}

  @Post()
  @HttpCode(200)
  async handleWebhook(
    @Req() req: any,
    @Res() res: Response,
    @Headers('x-paystack-signature') signature: string,
  ) {
    const secretKey =
      this.configService.get<string>('PAYSTACK_SECRET_KEY') || process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return res.status(400).send('Secret key not configured');
    }

    const rawBody = req.rawBody || Buffer.from(JSON.stringify(req.body));
    const hash = crypto.createHmac('sha512', secretKey).update(rawBody).digest('hex');
    if (hash !== signature) {
      this.logger.warn('Rejected Paystack webhook with invalid signature');
      return res.status(400).send('Invalid signature');
    }

    const event = req.body;
    if (event?.event === 'charge.success') {
      try {
        await this.ordersService.markPaidByReference(event.data?.reference);
      } catch (err) {
        this.logger.error(`Failed to process Paystack webhook: ${(err as Error).message}`);
      }
    }
    return res.status(200).send('Webhook processed');
  }
}
