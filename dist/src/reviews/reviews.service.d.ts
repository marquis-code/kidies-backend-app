import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { ProductDocument } from '../products/schemas/product.schema';
export declare class ReviewsService {
    private reviewModel;
    private productModel;
    constructor(reviewModel: Model<ReviewDocument>, productModel: Model<ProductDocument>);
    create(userId: string, productId: string, rating: number, comment: string): Promise<import("mongoose").Document<unknown, {}, ReviewDocument, {}, import("mongoose").DefaultSchemaOptions> & Review & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findByProduct(productId: string): Promise<(import("mongoose").Document<unknown, {}, ReviewDocument, {}, import("mongoose").DefaultSchemaOptions> & Review & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
