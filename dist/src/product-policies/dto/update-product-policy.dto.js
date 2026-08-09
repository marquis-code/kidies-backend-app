"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductPolicyDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_product_policy_dto_1 = require("./create-product-policy.dto");
class UpdateProductPolicyDto extends (0, mapped_types_1.PartialType)(create_product_policy_dto_1.CreateProductPolicyDto) {
}
exports.UpdateProductPolicyDto = UpdateProductPolicyDto;
//# sourceMappingURL=update-product-policy.dto.js.map