import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Order, OrderDocument } from './schemas/order.schema';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
export declare class OrdersService {
    private orderModel;
    private auditLogsService;
    private configService;
    constructor(orderModel: Model<OrderDocument>, auditLogsService: AuditLogsService, configService: ConfigService);
    private stripe;
    create(createOrderDto: any): Promise<any>;
    findAll(): Promise<Order[]>;
    findByEmail(email: string): Promise<Order[]>;
    trackOrder(email: string, orderNumber: string): Promise<Order | null>;
    findById(id: string): Promise<Order | null>;
    updateStatus(id: string, status: string): Promise<Order | null>;
    getAnalytics(): Promise<any>;
}
