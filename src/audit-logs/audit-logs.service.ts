import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';

@Injectable()
export class AuditLogsService {
  constructor(@InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>) {}

  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    const createdAuditLog = new this.auditLogModel(createAuditLogDto);
    return createdAuditLog.save();
  }

  async findAll(): Promise<AuditLog[]> {
    return this.auditLogModel.find().sort({ createdAt: -1 }).populate('user', 'firstName lastName email').exec();
  }

  async findOne(id: string): Promise<AuditLog> {
    const auditLog = await this.auditLogModel.findById(id).populate('user', 'firstName lastName email').exec();
    if (!auditLog) {
      throw new NotFoundException(`AuditLog #${id} not found`);
    }
    return auditLog;
  }

  async update(id: string, updateAuditLogDto: UpdateAuditLogDto): Promise<AuditLog> {
    const existingAuditLog = await this.auditLogModel.findByIdAndUpdate(id, updateAuditLogDto, { new: true }).exec();
    if (!existingAuditLog) {
      throw new NotFoundException(`AuditLog #${id} not found`);
    }
    return existingAuditLog;
  }

  async remove(id: string): Promise<any> {
    const deletedAuditLog = await this.auditLogModel.findByIdAndDelete(id).exec();
    if (!deletedAuditLog) {
      throw new NotFoundException(`AuditLog #${id} not found`);
    }
    return deletedAuditLog;
  }
}
