import { CouponsService } from './coupons.service';
export declare class CouponsController {
    private readonly couponsService;
    constructor(couponsService: CouponsService);
    create(createCouponDto: any): Promise<import("./coupon.schema").Coupon>;
    findAll(): Promise<import("./coupon.schema").Coupon[]>;
    validate(code: string): Promise<import("./coupon.schema").Coupon>;
    remove(id: string): Promise<any>;
}
