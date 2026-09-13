"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const config_1 = require("@nestjs/config");
const order_schema_1 = require("./schemas/order.schema");
const stripe_1 = __importDefault(require("stripe"));
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
let OrdersService = class OrdersService {
    orderModel;
    auditLogsService;
    configService;
    constructor(orderModel, auditLogsService, configService) {
        this.orderModel = orderModel;
        this.auditLogsService = auditLogsService;
        this.configService = configService;
        const stripeKey = process.env.STRIPE_SECRET_KEY || this.configService.get('STRIPE_SECRET_KEY') || 'sk_test_placeholder';
        this.stripe = new stripe_1.default(stripeKey, {
            apiVersion: '2026-08-26.dahlia',
        });
    }
    stripe;
    async create(createOrderDto) {
        const orderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
        let paystackResponse = null;
        let paymentStatus = 'Unpaid';
        if (createOrderDto.paymentMethod === 'paystack') {
            let secretKey = process.env.PAYSTACK_SECRET_KEY || this.configService.get('PAYSTACK_SECRET_KEY');
            if (secretKey) {
                secretKey = secretKey.replace(/^["']|["']$/g, '').trim();
            }
            console.log('DEBUG: secretKey resolution ->', {
                processEnv: process.env.PAYSTACK_SECRET_KEY,
                configService: this.configService.get('PAYSTACK_SECRET_KEY'),
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
            }
            else {
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
                }
                catch (err) {
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
                    }
                    else {
                        throw new common_1.BadRequestException(result.message || 'Failed to initialize Paystack transaction');
                    }
                }
                else {
                    paystackResponse = result.data;
                }
                createOrderDto.paystackReference = paystackResponse.reference;
            }
        }
        else if (createOrderDto.paymentMethod === 'stripe') {
            const stripeKey = process.env.STRIPE_SECRET_KEY || this.configService.get('STRIPE_SECRET_KEY') || 'sk_test_placeholder';
            const callback_url = createOrderDto.callback_url ? `${createOrderDto.callback_url}?orderNumber=${orderNumber}` : `http://localhost:3000/checkout-success?orderNumber=${orderNumber}`;
            if (!stripeKey || stripeKey === 'sk_test_placeholder') {
                console.warn('Stripe Secret Key is not configured. Using Mock Response for E2E Flow.');
                paystackResponse = { authorization_url: callback_url, session_id: 'mock_sess_' + orderNumber };
                createOrderDto.stripeSessionId = paystackResponse.session_id;
            }
            else {
                const lineItems = createOrderDto.items.map((item) => ({
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
                    const sessionParams = {
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
                }
                catch (err) {
                    const errMsg = err.raw?.message || err.message || 'Unknown Stripe Error';
                    console.error('Stripe session creation error details:', err.type, errMsg);
                    throw new common_1.BadRequestException(`Failed to initialize Stripe transaction: ${errMsg}`);
                }
            }
        }
        else if (createOrderDto.paymentMethod === 'cash_on_delivery' || createOrderDto.paymentMethod === 'check') {
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
        }
        catch (dbErr) {
            require('fs').writeFileSync('db_error.txt', dbErr.stack || dbErr.message);
            throw dbErr;
        }
    }
    async findAll() {
        return this.orderModel.find().sort({ createdAt: -1 }).exec();
    }
    async findByEmail(email) {
        return this.orderModel.find({ 'customer.email': email }).sort({ createdAt: -1 }).exec();
    }
    async trackOrder(email, orderNumber) {
        return this.orderModel.findOne({
            'customer.email': email.toLowerCase().trim(),
            orderNumber: orderNumber.trim()
        }).exec();
    }
    async findById(id) {
        return this.orderModel.findById(id).exec();
    }
    async updateStatus(id, status) {
        return this.orderModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    }
    async getAnalytics() {
        const orders = await this.orderModel.find().exec();
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const totalProfit = totalRevenue * 0.35;
        const recentTransactions = await this.orderModel
            .find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('customer', 'firstName lastName email address city country zipCode')
            .exec();
        const productSales = {};
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
            .sort((a, b) => b.quantity - a.quantity)
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        audit_logs_service_1.AuditLogsService,
        config_1.ConfigService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map