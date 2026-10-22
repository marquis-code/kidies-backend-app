import { Model } from 'mongoose';
import { Coupon } from './coupon.schema';
export declare class CouponsService {
    private couponModel;
    constructor(couponModel: Model<Coupon>);
    create(data: any): Promise<Coupon>;
    findAll(): Promise<Coupon[]>;
    findOne(id: string): Promise<Coupon>;
    update(id: string, data: any): Promise<Coupon>;
    validate(code: string, subtotal?: number): Promise<any>;
    remove(id: string): Promise<any>;
}
