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
exports.ProductPoliciesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_policy_schema_1 = require("./schemas/product-policy.schema");
let ProductPoliciesService = class ProductPoliciesService {
    policyModel;
    constructor(policyModel) {
        this.policyModel = policyModel;
    }
    async create(createProductPolicyDto) {
        const createdPolicy = new this.policyModel(createProductPolicyDto);
        return createdPolicy.save();
    }
    async findAll() {
        return this.policyModel.find().exec();
    }
    async findOne(id) {
        const policy = await this.policyModel.findById(id).exec();
        if (!policy) {
            throw new common_1.NotFoundException(`ProductPolicy #${id} not found`);
        }
        return policy;
    }
    async update(id, updateProductPolicyDto) {
        const existingPolicy = await this.policyModel.findByIdAndUpdate(id, updateProductPolicyDto, { new: true }).exec();
        if (!existingPolicy) {
            throw new common_1.NotFoundException(`ProductPolicy #${id} not found`);
        }
        return existingPolicy;
    }
    async remove(id) {
        const deletedPolicy = await this.policyModel.findByIdAndDelete(id).exec();
        if (!deletedPolicy) {
            throw new common_1.NotFoundException(`ProductPolicy #${id} not found`);
        }
        return deletedPolicy;
    }
};
exports.ProductPoliciesService = ProductPoliciesService;
exports.ProductPoliciesService = ProductPoliciesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_policy_schema_1.ProductPolicy.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProductPoliciesService);
//# sourceMappingURL=product-policies.service.js.map