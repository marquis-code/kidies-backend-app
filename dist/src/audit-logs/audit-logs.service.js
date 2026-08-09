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
exports.AuditLogsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const audit_log_schema_1 = require("./schemas/audit-log.schema");
let AuditLogsService = class AuditLogsService {
    auditLogModel;
    constructor(auditLogModel) {
        this.auditLogModel = auditLogModel;
    }
    async create(createAuditLogDto) {
        const createdAuditLog = new this.auditLogModel(createAuditLogDto);
        return createdAuditLog.save();
    }
    async findAll() {
        return this.auditLogModel.find().sort({ createdAt: -1 }).populate('user', 'firstName lastName email').exec();
    }
    async findOne(id) {
        const auditLog = await this.auditLogModel.findById(id).populate('user', 'firstName lastName email').exec();
        if (!auditLog) {
            throw new common_1.NotFoundException(`AuditLog #${id} not found`);
        }
        return auditLog;
    }
    async update(id, updateAuditLogDto) {
        const existingAuditLog = await this.auditLogModel.findByIdAndUpdate(id, updateAuditLogDto, { new: true }).exec();
        if (!existingAuditLog) {
            throw new common_1.NotFoundException(`AuditLog #${id} not found`);
        }
        return existingAuditLog;
    }
    async remove(id) {
        const deletedAuditLog = await this.auditLogModel.findByIdAndDelete(id).exec();
        if (!deletedAuditLog) {
            throw new common_1.NotFoundException(`AuditLog #${id} not found`);
        }
        return deletedAuditLog;
    }
};
exports.AuditLogsService = AuditLogsService;
exports.AuditLogsService = AuditLogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(audit_log_schema_1.AuditLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AuditLogsService);
//# sourceMappingURL=audit-logs.service.js.map