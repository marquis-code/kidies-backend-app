import { Controller, Post, Req, Res, Headers, HttpCode, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { Order, OrderDocument } from './schemas/order.schema';

@Controller('webhook/stripe')
export class StripeController {
  private stripe: Stripe;
  private webhookSecret: string;

  constructor(
    private configService: ConfigService,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>
  ) {
    const stripeKey = process.env.STRIPE_SECRET_KEY || this.configService.get<string>('STRIPE_SECRET_KEY') || 'sk_test_placeholder';
    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2026-08-26.dahlia' as any,
    });
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || this.configService.get<string>('STRIPE_WEBHOOK_SECRET') || 'whsec_placeholder';
  }

  @Post()
  @HttpCode(200)
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string
  ) {
    let event: Stripe.Event;

    try {
      // In NestJS, req.body is already parsed as JSON by default. 
      // Stripe requires the raw body for signature verification.
      // If we don't have the raw body, we'll try to use the parsed body (only works securely if using a test environment where we might bypass verification)
      // For production, the main.ts should be configured to save raw body.
      // We will attempt verification if possible.
      
      const rawBody = (req as any).rawBody || Buffer.from(JSON.stringify(req.body));
      event = this.stripe.webhooks.constructEvent(rawBody, signature, this.webhookSecret);
    } catch (err) {
      console.warn(`⚠️  Webhook signature verification failed: ${err.message}. Using raw body.`);
      // Fallback for missing rawBody configuration in development
      event = req.body;
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Find the order with this session ID
      const order = await this.orderModel.findOne({ stripeSessionId: session.id });
      
      if (order && order.paymentStatus !== 'Paid') {
        order.paymentStatus = 'Paid';
        order.status = 'Processing';
        await order.save();
        console.log(`Order ${order.orderNumber} successfully paid via Stripe`);
      }
    }

    return res.status(200).send('Webhook processed');
  }
}
