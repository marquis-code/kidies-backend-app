"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const orders_controller_1 = require("./orders.controller");
const orders_service_1 = require("./orders.service");
const order_schema_1 = require("./schemas/order.schema");
const auth_module_1 = require("../auth/auth.module");
const audit_logs_module_1 = require("../audit-logs/audit-logs.module");
const paystack_controller_1 = require("./paystack.controller");
const stripe_controller_1 = require("./stripe.controller");
const product_schema_1 = require("../products/schemas/product.schema");
const coupon_schema_1 = require("../coupons/coupon.schema");
const setting_schema_1 = require("../settings/schemas/setting.schema");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            audit_logs_module_1.AuditLogsModule,
            auth_module_1.AuthModule,
            mongoose_1.MongooseModule.forFeature([
                { name: order_schema_1.Order.name, schema: order_schema_1.OrderSchema },
                { name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema },
                { name: coupon_schema_1.Coupon.name, schema: coupon_schema_1.CouponSchema },
                { name: setting_schema_1.Setting.name, schema: setting_schema_1.SettingSchema },
            ]),
        ],
        controllers: [orders_controller_1.OrdersController, paystack_controller_1.PaystackController, stripe_controller_1.StripeController],
        providers: [orders_service_1.OrdersService],
    })
], OrdersModule);
//# sourceMappingURL=orders.module.js.map