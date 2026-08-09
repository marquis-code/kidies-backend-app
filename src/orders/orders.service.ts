import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Order, OrderDocument } from './schemas/order.schema';

import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private auditLogsService: AuditLogsService,
    private configService: ConfigService
  ) {}

  async create(createOrderDto: any): Promise<any> {
    // Generate a random order number like ORD-89241
    const orderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    
    let paystackResponse = null;
    let paymentStatus = 'Unpaid';
    
    // Paystack Integration
    if (createOrderDto.paymentMethod === 'paystack') {
      const secretKey = process.env.PAYSTACK_SECRET_KEY || this.configService.get<string>('PAYSTACK_SECRET_KEY');
      if (!secretKey) {
        throw new BadRequestException('Paystack Secret Key is not configured');
      }

      // Convert amount to kobo
      const amountInKobo = Math.round(createOrderDto.totalAmount * 100);

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
          callback_url: createOrderDto.callback_url ? `${createOrderDto.callback_url}?orderNumber=${orderNumber}` : `http://localhost:3000/checkout-success?orderNumber=${orderNumber}`,
        }),
      });

      const result = await response.json();
      
      if (!result.status) {
        throw new BadRequestException(result.message || 'Failed to initialize Paystack transaction');
      }
      
      paystackResponse = result.data;
      createOrderDto.paystackReference = result.data.reference;
    } else if (createOrderDto.paymentMethod === 'cash_on_delivery' || createOrderDto.paymentMethod === 'check') {
      paymentStatus = 'Unpaid';
    }

    const newOrder = new this.orderModel({ 
      ...createOrderDto, 
      orderNumber,
      paymentStatus,
    });
    
    const savedOrder = await newOrder.save();
    
    return {
      order: savedOrder,
      paystack: paystackResponse
    };
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().sort({ createdAt: -1 }).exec();
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
