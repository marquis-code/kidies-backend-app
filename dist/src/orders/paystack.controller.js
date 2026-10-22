"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PaystackController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaystackController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto = __importStar(require("crypto"));
const orders_service_1 = require("./orders.service");
let PaystackController = PaystackController_1 = class PaystackController {
    configService;
    ordersService;
    logger = new common_1.Logger(PaystackController_1.name);
    constructor(configService, ordersService) {
        this.configService = configService;
        this.ordersService = ordersService;
    }
    async handleWebhook(req, res, signature) {
        const secretKey = this.configService.get('PAYSTACK_SECRET_KEY') || process.env.PAYSTACK_SECRET_KEY;
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
            }
            catch (err) {
                this.logger.error(`Failed to process Paystack webhook: ${err.message}`);
            }
        }
        return res.status(200).send('Webhook processed');
    }
};
exports.PaystackController = PaystackController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Headers)('x-paystack-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], PaystackController.prototype, "handleWebhook", null);
exports.PaystackController = PaystackController = PaystackController_1 = __decorate([
    (0, common_1.Controller)('webhook/paystack'),
    __metadata("design:paramtypes", [config_1.ConfigService,
        orders_service_1.OrdersService])
], PaystackController);
//# sourceMappingURL=paystack.controller.js.map