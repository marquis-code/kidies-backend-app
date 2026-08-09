"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAuditLogDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_audit_log_dto_1 = require("./create-audit-log.dto");
class UpdateAuditLogDto extends (0, mapped_types_1.PartialType)(create_audit_log_dto_1.CreateAuditLogDto) {
}
exports.UpdateAuditLogDto = UpdateAuditLogDto;
//# sourceMappingURL=update-audit-log.dto.js.map