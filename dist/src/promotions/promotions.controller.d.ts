import { PromotionsService } from './promotions.service';
export declare class PromotionsController {
    private readonly promotionsService;
    constructor(promotionsService: PromotionsService);
    findAll(query: any): Promise<import("./schemas/promotion.schema").Promotion[]>;
    findOne(id: string): Promise<import("./schemas/promotion.schema").Promotion>;
    create(createPromotionDto: any): Promise<import("./schemas/promotion.schema").Promotion>;
    update(id: string, updatePromotionDto: any): Promise<import("./schemas/promotion.schema").Promotion>;
    remove(id: string): Promise<void>;
}
