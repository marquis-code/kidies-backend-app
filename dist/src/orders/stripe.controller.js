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
var StripeController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_1 = __importDefault(require("stripe"));
const orders_service_1 = require("./orders.service");
let StripeController = StripeController_1 = class StripeController {
    configService;
    ordersService;
    logger = new common_1.Logger(StripeController_1.name);
    stripe = null;
    webhookSecret;
    constructor(configService, ordersService) {
        this.configService = configService;
        this.ordersService = ordersService;
        const stripeKey = process.env.STRIPE_SECRET_KEY || this.configService.get('STRIPE_SECRET_KEY');
        if (stripeKey) {
            try {
                this.stripe = new stripe_1.default(stripeKey, { apiVersion: '2026-08-26.dahlia' });
            }
            catch {
                this.stripe = null;
            }
        }
        this.webhookSecret =
            process.env.STRIPE_WEBHOOK_SECRET ||
                this.configService.get('STRIPE_WEBHOOK_SECRET') ||
                '';
    }
    async handleWebhook(req, res, signature) {
        let event = req.body;
        if (this.stripe && this.webhookSecret && signature) {
            const rawBody = req.rawBody || Buffer.from(JSON.stringify(req.body));
            try {
                event = this.stripe.webhooks.constructEvent(rawBody, signature, this.webhookSecret);
            }
            catch (err) {
                this.logger.warn(`Stripe signature verification failed: ${err.message}`);
                return res.status(400).send('Invalid signature');
            }
        }
        if (event?.type === 'checkout.session.completed') {
            const session = event.data?.object;
            try {
                await this.ordersService.markPaidByReference(session?.id, session?.id);
            }
            catch (err) {
                this.logger.error(`Failed to process Stripe webhook: ${err.message}`);
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
exports.StripeController = StripeController = StripeController_1 = __decorate([
    (0, common_1.Controller)('webhook/stripe'),
    __metadata("design:paramtypes", [config_1.ConfigService,
        orders_service_1.OrdersService])
], StripeController);
//# sourceMappingURL=stripe.controller.js.map