import { AuditLogsService } from './audit-logs.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';
export declare class AuditLogsController {
    private readonly auditLogsService;
    constructor(auditLogsService: AuditLogsService);
    create(createAuditLogDto: CreateAuditLogDto): Promise<import("./schemas/audit-log.schema").AuditLog>;
    findAll(): Promise<import("./schemas/audit-log.schema").AuditLog[]>;
    findOne(id: string): Promise<import("./schemas/audit-log.schema").AuditLog>;
    update(id: string, updateAuditLogDto: UpdateAuditLogDto): Promise<import("./schemas/audit-log.schema").AuditLog>;
    remove(id: string): Promise<any>;
}
