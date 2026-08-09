import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createOrder(createOrderDto: any): Promise<any>;
    getOrders(): Promise<import("./schemas/order.schema").Order[]>;
    getAnalytics(): Promise<any>;
    getOrderById(id: string): Promise<import("./schemas/order.schema").Order | null>;
    updateOrderStatus(id: string, status: string): Promise<import("./schemas/order.schema").Order | null>;
}
