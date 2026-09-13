import { Document, Types } from 'mongoose';
export type ReviewDocument = Review & Document;
export declare class Review {
    productId: Types.ObjectId;
    userId: Types.ObjectId;
    rating: number;
    comment: string;
}
export declare const ReviewSchema: import("mongoose").Schema<Review, import("mongoose").Model<Review, any, any, any, any, any, Review>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Review, Document<unknown, {}, Review, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Review & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    productId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Review, Document<unknown, {}, Review, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Review & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Review, Document<unknown, {}, Review, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Review & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    rating?: import("mongoose").SchemaDefinitionProperty<number, Review, Document<unknown, {}, Review, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Review & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    comment?: import("mongoose").SchemaDefinitionProperty<string, Review, Document<unknown, {}, Review, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Review & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Review>;
