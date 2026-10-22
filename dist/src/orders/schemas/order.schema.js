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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSchema = exports.Order = exports.PAYMENT_STATUSES = exports.ORDER_STATUSES = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
exports.ORDER_STATUSES = [
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
];
exports.PAYMENT_STATUSES = ['Unpaid', 'Paid', 'Refunded'];
let Order = class Order {
    orderNumber;
    customer;
    items;
    subtotal;
    shippingFee;
    tax;
    discountAmount;
    couponCode;
    totalAmount;
    currency;
    paymentMethod;
    paystackReference;
    stripeSessionId;
    paymentReference;
    status;
    paymentStatus;
    paidAt;
    notes;
    statusHistory;
};
exports.Order = Order;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], Order.prototype, "orderNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], Order.prototype, "customer", void 0);
__decorate([
    (0, mongoose_1.Prop)([
        {
            productId: { type: mongoose_2.Types.ObjectId, ref: 'Product' },
            name: String,
            price: Number,
            quantity: Number,
            sku: String,
            size: String,
            color: String,
            image: String,
        },
    ]),
    __metadata("design:type", Array)
], Order.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Order.prototype, "subtotal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "shippingFee", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "tax", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "discountAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Order.prototype, "couponCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Order.prototype, "totalAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'USD' }),
    __metadata("design:type", String)
], Order.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['paystack', 'stripe', 'cash_on_delivery', 'check'],
        default: 'paystack',
    }),
    __metadata("design:type", String)
], Order.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Order.prototype, "paystackReference", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Order.prototype, "stripeSessionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Order.prototype, "paymentReference", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: exports.ORDER_STATUSES, default: 'Pending' }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: exports.PAYMENT_STATUSES, default: 'Unpaid' }),
    __metadata("design:type", String)
], Order.prototype, "paymentStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Order.prototype, "paidAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Order.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)([
        {
            status: String,
            changedAt: { type: Date, default: Date.now },
            note: String,
        },
    ]),
    __metadata("design:type", Array)
], Order.prototype, "statusHistory", void 0);
exports.Order = Order = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Order);
exports.OrderSchema = mongoose_1.SchemaFactory.createForClass(Order);
exports.OrderSchema.index({ 'customer.email': 1, createdAt: -1 });
//# sourceMappingURL=order.schema.js.map