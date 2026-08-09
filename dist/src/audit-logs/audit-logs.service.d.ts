import { Model } from 'mongoose';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';
export declare class AuditLogsService {
    private auditLogModel;
    constructor(auditLogModel: Model<AuditLogDocument>);
    create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog>;
    findAll(): Promise<AuditLog[]>;
    findOne(id: string): Promise<AuditLog>;
    update(id: string, updateAuditLogDto: UpdateAuditLogDto): Promise<AuditLog>;
    remove(id: string): Promise<any>;
}
