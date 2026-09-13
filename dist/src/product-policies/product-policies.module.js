"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductPoliciesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const product_policies_service_1 = require("./product-policies.service");
const product_policies_controller_1 = require("./product-policies.controller");
const product_policy_schema_1 = require("./schemas/product-policy.schema");
let ProductPoliciesModule = class ProductPoliciesModule {
};
exports.ProductPoliciesModule = ProductPoliciesModule;
exports.ProductPoliciesModule = ProductPoliciesModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: product_policy_schema_1.ProductPolicy.name, schema: product_policy_schema_1.ProductPolicySchema }])],
        controllers: [product_policies_controller_1.ProductPoliciesController],
        providers: [product_policies_service_1.ProductPoliciesService],
        exports: [product_policies_service_1.ProductPoliciesService],
    })
], ProductPoliciesModule);
//# sourceMappingURL=product-policies.module.js.map