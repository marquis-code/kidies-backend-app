import { Model } from 'mongoose';
import { Coupon } from './coupon.schema';
export declare class CouponsService {
    private couponModel;
    constructor(couponModel: Model<Coupon>);
    create(data: any): Promise<Coupon>;
    findAll(): Promise<Coupon[]>;
    validate(code: string): Promise<Coupon>;
    remove(id: string): Promise<any>;
}
