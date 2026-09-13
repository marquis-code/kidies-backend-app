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
exports.StripeController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const stripe_1 = __importDefault(require("stripe"));
const order_schema_1 = require("./schemas/order.schema");
let StripeController = class StripeController {
    configService;
    orderModel;
    stripe;
    webhookSecret;
    constructor(configService, orderModel) {
        this.configService = configService;
        this.orderModel = orderModel;
        const stripeKey = process.env.STRIPE_SECRET_KEY || this.configService.get('STRIPE_SECRET_KEY') || 'sk_test_placeholder';
        this.stripe = new stripe_1.default(stripeKey, {
            apiVersion: '2026-08-26.dahlia',
        });
        this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || this.configService.get('STRIPE_WEBHOOK_SECRET') || 'whsec_placeholder';
    }
    async handleWebhook(req, res, signature) {
        let event;
        try {
            const rawBody = req.rawBody || Buffer.from(JSON.stringify(req.body));
            event = this.stripe.webhooks.constructEvent(rawBody, signature, this.webhookSecret);
        }
        catch (err) {
            console.warn(`⚠️  Webhook signature verification failed: ${err.message}. Using raw body.`);
            event = req.body;
        }
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
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
};
exports.StripeController = StripeController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Headers)('stripe-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "handleWebhook", null);
exports.StripeController = StripeController = __decorate([
    (0, common_1.Controller)('webhook/stripe'),
    __param(1, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        mongoose_2.Model])
], StripeController);
//# sourceMappingURL=stripe.controller.js.map