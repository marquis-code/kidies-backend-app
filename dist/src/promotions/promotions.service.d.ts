import { Model } from 'mongoose';
import { Promotion, PromotionDocument } from './schemas/promotion.schema';
export declare class PromotionsService {
    private promotionModel;
    constructor(promotionModel: Model<PromotionDocument>);
    findAll(query?: any): Promise<Promotion[]>;
    findOne(id: string): Promise<Promotion>;
    create(createPromotionDto: any): Promise<Promotion>;
    update(id: string, updatePromotionDto: any): Promise<Promotion>;
    remove(id: string): Promise<void>;
}
