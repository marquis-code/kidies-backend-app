import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createOrder(createOrderDto: any): Promise<any>;
    trackOrder(body: {
        email: string;
        orderNumber: string;
    }): Promise<import("./schemas/order.schema").Order | null>;
    verifyPayment(body: {
        orderNumber: string;
        reference?: string;
    }): Promise<any>;
    lookupOrder(orderNumber: string, email?: string, reference?: string): Promise<any>;
    getOrders(query: any): Promise<any>;
    getMyOrders(req: any): Promise<import("./schemas/order.schema").Order[]>;
    getAnalytics(): Promise<any>;
    getOrderById(id: string, req: any): Promise<import("./schemas/order.schema").Order>;
    updateOrderStatus(id: string, status: string, req: any): Promise<import("./schemas/order.schema").Order | null>;
    cancelOrder(id: string, req: any): Promise<import("./schemas/order.schema").Order>;
    updatePaymentStatus(id: string, paymentStatus: string): Promise<import("./schemas/order.schema").Order>;
}
