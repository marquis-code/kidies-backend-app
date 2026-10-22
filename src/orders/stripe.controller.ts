import { Controller, Post, Req, Res, Headers, HttpCode, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { OrdersService } from './orders.service';

@Controller('webhook/stripe')
export class StripeController {
  private readonly logger = new Logger(StripeController.name);
  private stripe: Stripe | null = null;
  private webhookSecret: string;

  constructor(
    private configService: ConfigService,
    private ordersService: OrdersService,
  ) {
    const stripeKey =
      process.env.STRIPE_SECRET_KEY || this.configService.get<string>('STRIPE_SECRET_KEY');
    if (stripeKey) {
      try {
        this.stripe = new Stripe(stripeKey, { apiVersion: '2026-08-26.dahlia' as any });
      } catch {
        this.stripe = null;
      }
    }
    this.webhookSecret =
      process.env.STRIPE_WEBHOOK_SECRET ||
      this.configService.get<string>('STRIPE_WEBHOOK_SECRET') ||
      '';
  }

  @Post()
  @HttpCode(200)
  async handleWebhook(
    @Req() req: any,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    let event: any = req.body;
    if (this.stripe && this.webhookSecret && signature) {
      const rawBody = req.rawBody || Buffer.from(JSON.stringify(req.body));
      try {
        event = this.stripe.webhooks.constructEvent(rawBody, signature, this.webhookSecret);
      } catch (err) {
        this.logger.warn(`Stripe signature verification failed: ${(err as Error).message}`);
        return res.status(400).send('Invalid signature');
      }
    }

    if (event?.type === 'checkout.session.completed') {
      const session = event.data?.object;
      try {
        await this.ordersService.markPaidByReference(session?.id, session?.id);
      } catch (err) {
        this.logger.error(`Failed to process Stripe webhook: ${(err as Error).message}`);
      }
    }
    return res.status(200).send('Webhook processed');
  }
}
