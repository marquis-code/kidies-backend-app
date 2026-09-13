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
exports.ProductPolicySchema = exports.ProductPolicy = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let ProductPolicy = class ProductPolicy {
    name;
    productDetails;
    shippingAndReturns;
};
exports.ProductPolicy = ProductPolicy;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ProductPolicy.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ProductPolicy.prototype, "productDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ProductPolicy.prototype, "shippingAndReturns", void 0);
exports.ProductPolicy = ProductPolicy = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ProductPolicy);
exports.ProductPolicySchema = mongoose_1.SchemaFactory.createForClass(ProductPolicy);
//# sourceMappingURL=product-policy.schema.js.map