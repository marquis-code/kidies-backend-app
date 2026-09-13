import { Document } from 'mongoose';
export declare class Coupon extends Document {
    code: string;
    discountType: string;
    discountValue: number;
    isActive: boolean;
    expiryDate?: Date;
}
export declare const CouponSchema: import("mongoose").Schema<Coupon, import("mongoose").Model<Coupon, any, any, any, any, any, Coupon>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Coupon, Document<unknown, {}, Coupon, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Coupon & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    code?: import("mongoose").SchemaDefinitionProperty<string, Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    discountType?: import("mongoose").SchemaDefinitionProperty<string, Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    discountValue?: import("mongoose").SchemaDefinitionProperty<number, Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    expiryDate?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Coupon>;
