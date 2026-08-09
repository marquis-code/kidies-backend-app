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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const config_1 = require("@nestjs/config");
const order_schema_1 = require("./schemas/order.schema");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
let OrdersService = class OrdersService {
    orderModel;
    auditLogsService;
    configService;
    constructor(orderModel, auditLogsService, configService) {
        this.orderModel = orderModel;
        this.auditLogsService = auditLogsService;
        this.configService = configService;
    }
    async create(createOrderDto) {
        const orderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
        let paystackResponse = null;
        let paymentStatus = 'Unpaid';
        if (createOrderDto.paymentMethod === 'paystack') {
            const secretKey = process.env.PAYSTACK_SECRET_KEY || this.configService.get('PAYSTACK_SECRET_KEY');
            if (!secretKey) {
                throw new common_1.BadRequestException('Paystack Secret Key is not configured');
            }
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
                throw new common_1.BadRequestException(result.message || 'Failed to initialize Paystack transaction');
            }
            paystackResponse = result.data;
            createOrderDto.paystackReference = result.data.reference;
        }
        else if (createOrderDto.paymentMethod === 'cash_on_delivery' || createOrderDto.paymentMethod === 'check') {
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
    async findAll() {
        return this.orderModel.find().sort({ createdAt: -1 }).exec();
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