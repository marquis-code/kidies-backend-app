import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Order, OrderDocument } from './schemas/order.schema';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
export declare class OrdersService {
    private orderModel;
    private auditLogsService;
    private configService;
    constructor(orderModel: Model<OrderDocument>, auditLogsService: AuditLogsService, configService: ConfigService);
    create(createOrderDto: any): Promise<any>;
    findAll(): Promise<Order[]>;
    findById(id: string): Promise<Order | null>;
    updateStatus(id: string, status: string): Promise<Order | null>;
    getAnalytics(): Promise<any>;
}
