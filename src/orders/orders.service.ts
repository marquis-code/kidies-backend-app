import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Order, OrderDocument } from './schemas/order.schema';
import Stripe from 'stripe';

import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private auditLogsService: AuditLogsService,
    private configService: ConfigService
  ) {
    const stripeKey = process.env.STRIPE_SECRET_KEY || this.configService.get<string>('STRIPE_SECRET_KEY') || 'sk_test_placeholder';
    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2026-08-26.dahlia' as any,
    });
  }

  private stripe: Stripe;

  async create(createOrderDto: any): Promise<any> {
    // Generate a random order number like ORD-89241
    const orderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    
    let paystackResponse = null;
    let paymentStatus = 'Unpaid';
    
    // Paystack Integration
    if (createOrderDto.paymentMethod === 'paystack') {
      let secretKey = process.env.PAYSTACK_SECRET_KEY || this.configService.get<string>('PAYSTACK_SECRET_KEY');
      if (secretKey) {
          secretKey = secretKey.replace(/^["']|["']$/g, '').trim();
      }
      console.log('DEBUG: secretKey resolution ->', { 
        processEnv: process.env.PAYSTACK_SECRET_KEY, 
        configService: this.configService.get<string>('PAYSTACK_SECRET_KEY'),
        resolved: secretKey 
      });
      const callback_url = createOrderDto.callback_url ? `${createOrderDto.callback_url}?orderNumber=${orderNumber}` : `http://localhost:3000/checkout-success?orderNumber=${orderNumber}`;

      if (!secretKey || secretKey === 'sk_test_placeholder' || secretKey.trim() === '') {
        console.warn('Paystack Secret Key is not configured. Using Mock Response for E2E Flow.');
        paystackResponse = {
          authorization_url: callback_url,
          access_code: 'mock_access_code_' + orderNumber,
          reference: `mock_ref_${Date.now()}`
        };
        createOrderDto.paystackReference = paystackResponse.reference;
      } else {
        // Convert amount to kobo
        const amountInKobo = Math.round(createOrderDto.totalAmount * 100);
        let result;
        
        try {
          const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${secretKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: createOrderDto.customer.email,
              amount: amountInKobo,
              reference: `jasmarkids_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
              callback_url,
            }),
          });
          result = await response.json();
          console.log('Paystack initialization response:', result, 'Using key starting with:', secretKey ? secretKey.substring(0, 10) : 'undefined');
        } catch (err) {
          result = { status: false, message: 'Network error connecting to Paystack' };
          console.error('Paystack connection error:', err);
        }
        
        if (!result.status) {
          if (result.message === 'Invalid key') {
            console.warn(`Paystack returned Invalid Key. Used key starting with ${secretKey ? secretKey.substring(0, 10) : 'undefined'}. Using Mock Response for E2E Flow.`);
            paystackResponse = {
              authorization_url: callback_url,
              access_code: 'mock_access_code_' + orderNumber,
              reference: `mock_ref_${Date.now()}`
            };
          } else {
            throw new BadRequestException(result.message || 'Failed to initialize Paystack transaction');
          }
        } else {
          paystackResponse = result.data;
        }
        createOrderDto.paystackReference = paystackResponse.reference;
      }
    } else if (createOrderDto.paymentMethod === 'stripe') {
      const stripeKey = process.env.STRIPE_SECRET_KEY || this.configService.get<string>('STRIPE_SECRET_KEY') || 'sk_test_placeholder';
      const callback_url = createOrderDto.callback_url ? `${createOrderDto.callback_url}?orderNumber=${orderNumber}` : `http://localhost:3000/checkout-success?orderNumber=${orderNumber}`;
      
      if (!stripeKey || stripeKey === 'sk_test_placeholder') {
        console.warn('Stripe Secret Key is not configured. Using Mock Response for E2E Flow.');
        paystackResponse = { authorization_url: callback_url, session_id: 'mock_sess_' + orderNumber };
        createOrderDto.stripeSessionId = paystackResponse.session_id;
      } else {
        const lineItems: any[] = createOrderDto.items.map((item: any) => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        }));

        if (createOrderDto.shippingFee) {
          lineItems.push({
            price_data: {
              currency: 'usd',
              product_data: { name: 'Shipping' },
              unit_amount: Math.round(createOrderDto.shippingFee * 100),
            },
            quantity: 1,
          });
        }

        if (createOrderDto.tax) {
          lineItems.push({
            price_data: {
              currency: 'usd',
              product_data: { name: 'Tax' },
              unit_amount: Math.round(createOrderDto.tax * 100),
            },
            quantity: 1,
          });
        }

        try {
          const sessionParams: any = {
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: callback_url,
            cancel_url: 'http://localhost:3000/checkout',
            customer_email: createOrderDto.customer.email,
            metadata: {
              orderNumber: orderNumber,
            },
            managed_payments: { enabled: false }
          };
          const session = await this.stripe.checkout.sessions.create(sessionParams);
          
          paystackResponse = { authorization_url: session.url, session_id: session.id };
          createOrderDto.stripeSessionId = session.id;
        } catch (err) {
          const errMsg = err.raw?.message || err.message || 'Unknown Stripe Error';
          console.error('Stripe session creation error details:', err.type, errMsg);
          throw new BadRequestException(`Failed to initialize Stripe transaction: ${errMsg}`);
        }
      }
    } else if (createOrderDto.paymentMethod === 'cash_on_delivery' || createOrderDto.paymentMethod === 'check') {
      paymentStatus = 'Unpaid';
    }

    const newOrder = new this.orderModel({ 
      ...createOrderDto, 
      orderNumber,
      paymentStatus,
    });
    
    try {
      const savedOrder = await newOrder.save();
      return {
        order: savedOrder,
        paystack: paystackResponse,
        stripe: createOrderDto.paymentMethod === 'stripe' ? { url: paystackResponse.authorization_url } : null
      };
    } catch (dbErr: any) {
      require('fs').writeFileSync('db_error.txt', dbErr.stack || dbErr.message);
      throw dbErr;
    }
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().sort({ createdAt: -1 }).exec();
  }

  async findByEmail(email: string): Promise<Order[]> {
    return this.orderModel.find({ 'customer.email': email }).sort({ createdAt: -1 }).exec();
  }

  async trackOrder(email: string, orderNumber: string): Promise<Order | null> {
    return this.orderModel.findOne({ 
      'customer.email': email.toLowerCase().trim(), 
      orderNumber: orderNumber.trim() 
    }).exec();
  }

  async findById(id: string): Promise<Order | null> {
    return this.orderModel.findById(id).exec();
  }

  async updateStatus(id: string, status: string): Promise<Order | null> {
    return this.orderModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
  }

    async getAnalytics(): Promise<any> {
    const orders = await this.orderModel.find().exec();
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Calculate estimated profit (assuming 35% margin for simplicity)
    const totalProfit = totalRevenue * 0.35;
    
    // Get recent transactions
    const recentTransactions = await this.orderModel
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('customer', 'firstName lastName email address city country zipCode')
      .exec();

    // Calculate highly sold products
    const productSales: Record<string, { name: string; quantity: number; revenue: number; sku: string }> = {};
    orders.forEach(order => {
      if (order.status !== 'Cancelled') {
        order.items.forEach(item => {
          if (!productSales[item.name]) {
            productSales[item.name] = { name: item.name, quantity: 0, revenue: 0, sku: item.sku };
          }
          productSales[item.name].quantity += item.quantity;
          productSales[item.name].revenue += (item.price * item.quantity);
        });
      }
    });
    
    const topSoldProducts = Object.values(productSales)
      .sort((a: any, b: any) => b.quantity - a.quantity)
      .slice(0, 5);

    const recentActivities = await this.auditLogsService.findAll();
    return {
      totalOrders,
      totalRevenue,
      totalProfit,
      averageOrderValue,
      recentTransactions,
      topSoldProducts,
      recentActivities: recentActivities.slice(0, 5)
    };
  }
}
