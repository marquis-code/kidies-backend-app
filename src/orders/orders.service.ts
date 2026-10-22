import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

import { Order, OrderDocument, ORDER_STATUSES } from './schemas/order.schema';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { Coupon, CouponSchema } from '../coupons/coupon.schema';
import { Setting, SettingSchema } from '../settings/schemas/setting.schema';

const DEFAULT_SHIPPING_FEE = 5.95;
const DEFAULT_FREE_SHIPPING_THRESHOLD = 30;
const DEFAULT_TAX_RATE = 8;

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  private stripe: Stripe | null = null;

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Coupon.name) private couponModel: Model<Coupon>,
    @InjectModel(Setting.name) private settingModel: Model<Setting>,
    private auditLogsService: AuditLogsService,
    private configService: ConfigService,
  ) {
    const stripeKey =
      process.env.STRIPE_SECRET_KEY || this.configService.get<string>('STRIPE_SECRET_KEY');
    if (stripeKey) {
      try {
        this.stripe = new Stripe(stripeKey, {
          apiVersion: '2026-08-26.dahlia' as any,
        });
      } catch (err) {
        this.logger.warn(`Stripe could not be initialised: ${(err as Error).message}`);
      }
    }
  }

  private get paymentsMock(): boolean {
    return (
      process.env.PAYMENTS_MOCK === 'true' ||
      process.env.NODE_ENV !== 'production' ||
      !process.env.PAYSTACK_SECRET_KEY
    );
  }

  private async getStoreSettings(): Promise<any> {
    const doc = await this.settingModel.findOne({ key: 'global' }).lean().exec();
    return doc || {};
  }

  private async generateOrderNumber(): Promise<string> {
    for (let attempt = 0; attempt < 10; attempt++) {
      const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const exists = await this.orderModel.exists({ orderNumber });
      if (!exists) return orderNumber;
    }
    return `ORD-${Date.now()}`;
  }

  private validateCustomer(customer: any) {
    if (!customer || typeof customer !== 'object') {
      throw new BadRequestException('Customer shipping details are required');
    }
    const required = ['firstName', 'lastName', 'email', 'address', 'city', 'country', 'zipCode'];
    const missing = required.filter((field) => !customer[field] || String(customer[field]).trim() === '');
    if (missing.length) {
      throw new BadRequestException(`Missing shipping details: ${missing.join(', ')}`);
    }
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(String(customer.email))) {
      throw new BadRequestException('A valid customer email is required');
    }
  }

  private async resolveCoupon(code: any, subtotal: number): Promise<{ coupon: any; discount: number }> {
    if (!code) return { coupon: null, discount: 0 };
    const coupon = await this.couponModel.findOne({ code: String(code).toUpperCase().trim() });
    if (!coupon) throw new BadRequestException('Invalid coupon code');
    if (!coupon.isActive) throw new BadRequestException('This coupon is no longer active');
    if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
      throw new BadRequestException('This coupon has expired');
    }
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * Number(coupon.discountValue)) / 100;
    } else {
      discount = Number(coupon.discountValue);
    }
    discount = Math.min(Math.max(0, discount), subtotal);
    return { coupon, discount: Math.round(discount * 100) / 100 };
  }

  private async prepareItems(rawItems: any[]) {
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      throw new BadRequestException('Your cart is empty');
    }

    const items: any[] = [];
    for (const raw of rawItems) {
      const productId = raw.productId || raw._id || raw.id;
      if (!productId || !Types.ObjectId.isValid(String(productId))) {
        throw new BadRequestException('One of the cart items is invalid');
      }
      const product = await this.productModel.findById(productId).exec();
      if (!product || product.status !== 'active') {
        throw new BadRequestException(`Product is no longer available: ${raw.name || productId}`);
      }
      const quantity = Math.max(1, Math.floor(Number(raw.quantity) || 1));
      const size = raw.size || raw.options?.size || '';
      const color = raw.color || raw.options?.color || '';

      // Stock validation against the matching variant (when variants exist)
      if (Array.isArray(product.variants) && product.variants.length) {
        const matching = product.variants.filter(
          (v: any) =>
            (!size || String(v.size) === String(size)) &&
            (!color || String(v.color).toLowerCase() === String(color).toLowerCase()),
        );
        const available = (matching.length ? matching : product.variants).reduce(
          (sum: number, v: any) => sum + (Number(v.stockQuantity) || 0),
          0,
        );
        if (available < quantity) {
          throw new BadRequestException(
            `${product.name}${size ? ` (${size})` : ''} only has ${available} item(s) left`,
          );
        }
      }

      const image =
        product.imageUrls?.thumbnail ||
        product.imageUrls?.medium ||
        (product.images || []).map((i: any) => i.url).find(Boolean) ||
        '';

      items.push({
        productId: product._id,
        name: product.name,
        price: Number(product.basePrice) || 0,
        quantity,
        sku: raw.sku || product.sku,
        size,
        color,
        image,
      });
    }
    return items;
  }

  private async decrementStock(items: any[]) {
    for (const item of items) {
      const product = await this.productModel.findById(item.productId);
      if (!product || !Array.isArray(product.variants) || !product.variants.length) continue;
      let remaining = item.quantity;
      const ordered = product.variants.filter(
        (v: any) =>
          (!item.size || String(v.size) === String(item.size)) &&
          (!item.color || String(v.color).toLowerCase() === String(item.color).toLowerCase()),
      );
      const pool = ordered.length ? ordered : product.variants;
      for (const variant of pool) {
        if (remaining <= 0) break;
        const stock = Number(variant.stockQuantity) || 0;
        const taken = Math.min(stock, remaining);
        variant.stockQuantity = stock - taken;
        remaining -= taken;
      }
      product.markModified('variants');
      await product.save();
    }
  }

  private async restoreStock(items: any[]) {
    for (const item of items) {
      const product = await this.productModel.findById(item.productId);
      if (!product || !Array.isArray(product.variants) || !product.variants.length) continue;
      const variant =
        product.variants.find(
          (v: any) =>
            (!item.size || String(v.size) === String(item.size)) &&
            (!item.color ||
              String(v.color).toLowerCase() === String(item.color).toLowerCase()),
        ) || product.variants[0];
      if (variant) {
        variant.stockQuantity = (Number(variant.stockQuantity) || 0) + item.quantity;
        product.markModified('variants');
        await product.save();
      }
    }
  }

  private buildCallbackUrl(orderNumber: string, requested?: string): string {
    const base =
      requested ||
      process.env.FRONTEND_URL ||
      process.env.STOREFRONT_URL ||
      'http://localhost:3100';
    const url = new URL(base);
    url.searchParams.set('orderNumber', orderNumber);
    return url.toString();
  }

  async create(createOrderDto: any): Promise<any> {
    const customer = {
      firstName: String(createOrderDto?.customer?.firstName || '').trim(),
      lastName: String(createOrderDto?.customer?.lastName || '').trim(),
      email: String(createOrderDto?.customer?.email || '').toLowerCase().trim(),
      address: String(createOrderDto?.customer?.address || '').trim(),
      city: String(createOrderDto?.customer?.city || '').trim(),
      state: String(createOrderDto?.customer?.state || '').trim(),
      country: String(createOrderDto?.customer?.country || '').trim(),
      zipCode: String(createOrderDto?.customer?.zipCode || '').trim(),
      phone: String(createOrderDto?.customer?.phoneNumber || createOrderDto?.customer?.phone || '').trim(),
    };
    this.validateCustomer(customer);

    const items = await this.prepareItems(createOrderDto.items);
    const subtotal = Math.round(items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100) / 100;

    const settings = await this.getStoreSettings();
    const general = settings.general || {};
    const currency = (general.currency || 'USD').toUpperCase();
    const taxRate = Number(general.taxRate ?? DEFAULT_TAX_RATE);
    const configuredShipping = Number(general.shippingFee ?? DEFAULT_SHIPPING_FEE);
    const freeShippingThreshold = Number(
      general.freeShippingThreshold ?? DEFAULT_FREE_SHIPPING_THRESHOLD,
    );

    const { coupon, discount } = await this.resolveCoupon(
      createOrderDto.couponCode || createOrderDto.coupon,
      subtotal,
    );

    const discountedSubtotal = Math.max(0, subtotal - discount);
    const shippingFee =
      discountedSubtotal >= freeShippingThreshold ? 0 : Math.round(configuredShipping * 100) / 100;
    const tax = Math.round(discountedSubtotal * (taxRate / 100) * 100) / 100;
    const totalAmount = Math.round((discountedSubtotal + shippingFee + tax) * 100) / 100;

    const orderNumber = await this.generateOrderNumber();
    const paymentMethod = createOrderDto.paymentMethod || 'paystack';
    const callbackUrl = this.buildCallbackUrl(orderNumber, createOrderDto.callback_url);

    let paystackResponse: any = null;
    let stripeResponse: any = null;
    let paymentStatus = 'Unpaid';
    let status = 'Pending';
    let paymentReference = '';

    if (paymentMethod === 'paystack') {
      const secretKey = (process.env.PAYSTACK_SECRET_KEY || '').replace(/^["']|["']$/g, '').trim();
      if (this.paymentsMock || !secretKey) {
        paymentReference = `mock_paystack_${orderNumber}`;
        paystackResponse = {
          authorization_url: `${callbackUrl}&reference=${paymentReference}`,
          access_code: `mock_access_${orderNumber}`,
          reference: paymentReference,
        };
      } else {
        try {
          const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${secretKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: customer.email,
              amount: Math.round(totalAmount * 100),
              currency,
              reference: `jk_${orderNumber}_${Date.now()}`,
              callback_url: callbackUrl,
              metadata: { orderNumber, items: items.length },
            }),
          });
          const result: any = await response.json();
          if (!result.status) {
            throw new BadRequestException(result.message || 'Failed to initialise Paystack payment');
          }
          paymentReference = result.data.reference;
          paystackResponse = result.data;
        } catch (err: any) {
          if (err instanceof BadRequestException) throw err;
          this.logger.error(`Paystack initialisation failed: ${err?.message}`);
          throw new BadRequestException(
            'Payment provider is currently unavailable. Please try again or use cash on delivery.',
          );
        }
      }
    } else if (paymentMethod === 'stripe') {
      if (!this.stripe || this.paymentsMock) {
        paymentReference = `mock_stripe_${orderNumber}`;
        stripeResponse = {
          url: `${callbackUrl}&reference=${paymentReference}`,
          session_id: paymentReference,
        };
      } else {
        const lineItems: any[] = items.map((item) => ({
          price_data: {
            currency: currency.toLowerCase(),
            product_data: { name: item.name + (item.size ? ` - ${item.size}` : '') },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        }));
        if (shippingFee > 0) {
          lineItems.push({
            price_data: {
              currency: currency.toLowerCase(),
              product_data: { name: 'Shipping' },
              unit_amount: Math.round(shippingFee * 100),
            },
            quantity: 1,
          });
        }
        if (tax > 0) {
          lineItems.push({
            price_data: {
              currency: currency.toLowerCase(),
              product_data: { name: 'Tax' },
              unit_amount: Math.round(tax * 100),
            },
            quantity: 1,
          });
        }
        try {
          const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: callbackUrl,
            cancel_url: callbackUrl.replace('orderNumber=', 'cancelled='),
            customer_email: customer.email,
            metadata: { orderNumber },
          } as any);
          paymentReference = session.id;
          stripeResponse = { url: session.url, session_id: session.id };
        } catch (err: any) {
          const message = err?.raw?.message || err?.message || 'Unknown Stripe error';
          this.logger.error(`Stripe session creation failed: ${message}`);
          throw new BadRequestException(`Failed to initialise Stripe payment: ${message}`);
        }
      }
    } else if (paymentMethod === 'cash_on_delivery' || paymentMethod === 'check') {
      paymentStatus = 'Unpaid';
      status = 'Processing';
    }

    const orderPayload: any = {
      orderNumber,
      customer,
      items,
      subtotal,
      shippingFee,
      tax,
      discountAmount: discount,
      couponCode: coupon?.code,
      totalAmount,
      currency,
      paymentMethod,
      paymentStatus,
      status,
      statusHistory: [{ status, changedAt: new Date(), note: 'Order created' }],
      notes: createOrderDto.notes,
    };
    if (paymentMethod === 'paystack') {
      orderPayload.paystackReference = paymentReference;
      orderPayload.paymentReference = paymentReference;
    }
    if (paymentMethod === 'stripe') {
      orderPayload.stripeSessionId = paymentReference;
      orderPayload.paymentReference = paymentReference;
    }

    const savedOrder = await new this.orderModel(orderPayload).save();
    await this.decrementStock(items);

    if (coupon) {
      await this.couponModel
        .findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } })
        .catch(() => undefined);
    }

    await this.auditLogsService
      .create({
        action: 'order.created',
        entity: 'Order',
        entityId: String(savedOrder._id),
        details: `Order ${orderNumber} placed by ${customer.email}`,
      } as any)
      .catch(() => undefined);

    return {
      order: savedOrder,
      paystack: paystackResponse,
      stripe: stripeResponse,
    };
  }

  async findAll(query: any = {}): Promise<any> {
    const filter: any = {};
    if (query.status && query.status !== 'all') {
      filter.status = { $in: String(query.status).split(',') };
    }
    if (query.paymentStatus && query.paymentStatus !== 'all') {
      filter.paymentStatus = query.paymentStatus;
    }
    if (query.search) {
      const rx = new RegExp(String(query.search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { orderNumber: rx },
        { 'customer.email': rx },
        { 'customer.firstName': rx },
        { 'customer.lastName': rx },
      ];
    }
    if (query.from || query.to) {
      filter.createdAt = {};
      if (query.from) filter.createdAt.$gte = new Date(query.from);
      if (query.to) filter.createdAt.$lte = new Date(query.to);
    }

    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(200, Math.max(1, parseInt(query.limit, 10) || 50));
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.orderModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.orderModel.countDocuments(filter),
    ]);

    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findByEmail(email: string): Promise<Order[]> {
    if (!email) return [];
    const rx = new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    return this.orderModel.find({ 'customer.email': rx }).sort({ createdAt: -1 }).exec();
  }

  async trackOrder(email: string, orderNumber: string): Promise<Order | null> {
    if (!email || !orderNumber) return null;
    const emailRx = new RegExp(`^${String(email).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    return this.orderModel
      .findOne({
        'customer.email': emailRx,
        orderNumber: String(orderNumber).trim(),
      })
      .exec();
  }

  async findByOrderNumber(orderNumber: string, email?: string, reference?: string): Promise<any> {
    const order = await this.orderModel
      .findOne({ orderNumber: String(orderNumber).trim() })
      .exec();
    if (!order) throw new NotFoundException('Order not found');

    const emailMatches =
      !!email &&
      String(email).trim().toLowerCase() === String(order.customer?.email || '').toLowerCase();
    const referenceMatches =
      !!reference &&
      [order.paymentReference, order.paystackReference, order.stripeSessionId]
        .filter(Boolean)
        .includes(String(reference));

    if (emailMatches || referenceMatches) return order;

    // Public lookup without proof of ownership returns a redacted summary only.
    return {
      _id: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      currency: order.currency,
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      tax: order.tax,
      discountAmount: order.discountAmount,
      totalAmount: order.totalAmount,
      items: (order.items || []).map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
      })),
      createdAt: (order as any).createdAt,
      redacted: true,
    };
  }

  async findById(id: string, requester?: any): Promise<Order> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Order not found');
    const order = await this.orderModel.findById(id).exec();
    if (!order) throw new NotFoundException('Order not found');

    if (requester && requester.role !== 'admin') {
      const sameEmail =
        String(requester.email || '').toLowerCase() ===
        String(order.customer?.email || '').toLowerCase();
      if (!sameEmail) throw new ForbiddenException('You cannot view this order');
    }
    return order;
  }

  async updateStatus(id: string, status: string, requester?: any): Promise<Order | null> {
    if (!ORDER_STATUSES.includes(status as any)) {
      throw new BadRequestException(`Invalid order status: ${status}`);
    }
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Order not found');

    const existing = await this.orderModel.findById(id);
    if (!existing) throw new NotFoundException('Order not found');

    if (status === 'Cancelled' && existing.status !== 'Cancelled') {
      await this.restoreStock(existing.items);
    }
    if (existing.status === 'Cancelled' && status !== 'Cancelled') {
      await this.decrementStock(existing.items);
    }

    existing.status = status;
    existing.statusHistory = [
      ...(existing.statusHistory || []),
      {
        status,
        changedAt: new Date(),
        note: `Status changed to ${status}`,
      },
    ];
    if (status === 'Delivered' && existing.paymentStatus === 'Unpaid') {
      existing.paymentStatus = 'Paid';
      existing.paidAt = new Date();
    }
    await existing.save();

    await this.auditLogsService
      .create({
        action: 'order.status_updated',
        entity: 'Order',
        entityId: id,
        details: `Order ${existing.orderNumber} status changed to ${status}`,
      } as any)
      .catch(() => undefined);

    return existing;
  }

  async cancelByCustomer(id: string, requester: any): Promise<Order> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Order not found');
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Order not found');

    const sameEmail =
      String(requester?.email || '').toLowerCase() ===
      String(order.customer?.email || '').toLowerCase();
    if (requester?.role !== 'admin' && !sameEmail) {
      throw new ForbiddenException('You cannot cancel this order');
    }
    if (!['Pending', 'Processing'].includes(order.status)) {
      throw new BadRequestException('This order can no longer be cancelled');
    }
    await this.restoreStock(order.items);
    order.status = 'Cancelled';
    order.statusHistory = [
      ...(order.statusHistory || []),
      { status: 'Cancelled', changedAt: new Date(), note: 'Cancelled by customer' },
    ];
    await order.save();
    return order;
  }

  async updatePaymentStatus(id: string, paymentStatus: string): Promise<Order> {
    if (!['Unpaid', 'Paid', 'Refunded'].includes(paymentStatus)) {
      throw new BadRequestException('Invalid payment status');
    }
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    order.paymentStatus = paymentStatus;
    if (paymentStatus === 'Paid') {
      order.paidAt = new Date();
      if (order.status === 'Pending') order.status = 'Processing';
    }
    if (paymentStatus === 'Refunded') {
      order.status = 'Cancelled';
      await this.restoreStock(order.items);
    }
    await order.save();
    return order;
  }

  /**
   * Called by the storefront when the customer returns from a payment provider.
   * In mock mode this simply marks the order paid; in live mode the provider is
   * contacted to confirm the transaction before anything is changed.
   */
  async verifyPayment(orderNumber: string, reference?: string): Promise<any> {
    const order = await this.orderModel.findOne({ orderNumber: String(orderNumber).trim() });
    if (!order) throw new NotFoundException('Order not found');
    if (order.paymentStatus === 'Paid') return order;

    const referenceValue = reference || order.paymentReference;
    if (!referenceValue) {
      throw new BadRequestException('No payment reference found for this order');
    }

    if (String(referenceValue).startsWith('mock_') || this.paymentsMock) {
      order.paymentStatus = 'Paid';
      order.paidAt = new Date();
      if (order.status === 'Pending') order.status = 'Processing';
      order.statusHistory = [
        ...(order.statusHistory || []),
        { status: order.status, changedAt: new Date(), note: 'Payment confirmed (mock)' },
      ];
      await order.save();
      return order;
    }

    if (order.paymentMethod === 'paystack') {
      const secretKey = (process.env.PAYSTACK_SECRET_KEY || '').trim();
      const response = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(referenceValue)}`,
        { headers: { Authorization: `Bearer ${secretKey}` } },
      );
      const result: any = await response.json();
      if (!result.status || result.data?.status !== 'success') {
        throw new BadRequestException('Payment has not been completed yet');
      }
    } else if (order.paymentMethod === 'stripe' && this.stripe) {
      const session = await this.stripe.checkout.sessions.retrieve(referenceValue);
      if (session.payment_status !== 'paid') {
        throw new BadRequestException('Payment has not been completed yet');
      }
    }

    order.paymentStatus = 'Paid';
    order.paidAt = new Date();
    if (order.status === 'Pending') order.status = 'Processing';
    order.statusHistory = [
      ...(order.statusHistory || []),
      { status: order.status, changedAt: new Date(), note: 'Payment confirmed' },
    ];
    await order.save();
    return order;
  }

  async markPaidByReference(reference: string, sessionId?: string): Promise<Order | null> {
    const filter: any = {
      $or: [{ paystackReference: reference }, { paymentReference: reference }, { stripeSessionId: sessionId }],
    };
    const order = await this.orderModel.findOne(filter);
    if (!order || order.paymentStatus === 'Paid') return order || null;
    order.paymentStatus = 'Paid';
    order.paidAt = new Date();
    if (order.status === 'Pending') order.status = 'Processing';
    order.statusHistory = [
      ...(order.statusHistory || []),
      { status: order.status, changedAt: new Date(), note: 'Payment confirmed via webhook' },
    ];
    await order.save();
    return order;
  }

  async getAnalytics(): Promise<any> {
    const orders = await this.orderModel.find().exec();
    const paidOrders = orders.filter((o) => o.paymentStatus === 'Paid');
    const validOrders = orders.filter((o) => o.status !== 'Cancelled');
    const totalOrders = orders.length;
    const totalRevenue = validOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const paidRevenue = paidOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const averageOrderValue = validOrders.length > 0 ? totalRevenue / validOrders.length : 0;

    const totalProfit = paidOrders.reduce((sum, order) => {
      const subtotal = order.subtotal || 0;
      return sum + subtotal * 0.35;
    }, 0);

    const statusBreakdown: Record<string, number> = {};
    orders.forEach((o) => {
      statusBreakdown[o.status] = (statusBreakdown[o.status] || 0) + 1;
    });

    const monthMap: Record<string, { revenue: number; orders: number }> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - i);
      monthMap[`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`] = {
        revenue: 0,
        orders: 0,
      };
    }
    orders.forEach((order) => {
      const d = new Date((order as any).createdAt || Date.now());
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (monthMap[key]) {
        monthMap[key].orders += 1;
        if (order.status !== 'Cancelled') monthMap[key].revenue += order.totalAmount || 0;
      }
    });

    const recentTransactions = await this.orderModel.find().sort({ createdAt: -1 }).limit(5).exec();

    const productSales: Record<string, { name: string; quantity: number; revenue: number; sku: string }> = {};
    orders.forEach((order) => {
      if (order.status === 'Cancelled') return;
      (order.items || []).forEach((item) => {
        if (!productSales[item.name]) {
          productSales[item.name] = { name: item.name, quantity: 0, revenue: 0, sku: item.sku };
        }
        productSales[item.name].quantity += item.quantity;
        productSales[item.name].revenue += item.price * item.quantity;
      });
    });

    const topSoldProducts = Object.values(productSales)
      .sort((a: any, b: any) => b.quantity - a.quantity)
      .slice(0, 5);

    const recentActivities = await this.auditLogsService.findAll();

    return {
      totalOrders,
      totalRevenue,
      paidRevenue,
      totalProfit,
      averageOrderValue,
      statusBreakdown,
      monthlyRevenue: Object.entries(monthMap).map(([month, value]) => ({ month, ...value })),
      recentTransactions,
      topSoldProducts,
      recentActivities: recentActivities.slice(0, 5),
    };
  }
}
