import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(req: any, createReviewDto: {
        productId: string;
        rating: number;
        comment: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/review.schema").ReviewDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/review.schema").Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findByProduct(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/review.schema").ReviewDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/review.schema").Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
