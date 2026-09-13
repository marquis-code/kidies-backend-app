import { Document } from 'mongoose';
export type ProductPolicyDocument = ProductPolicy & Document;
export declare class ProductPolicy {
    name: string;
    productDetails: string;
    shippingAndReturns: string;
}
export declare const ProductPolicySchema: import("mongoose").Schema<ProductPolicy, import("mongoose").Model<ProductPolicy, any, any, any, any, any, ProductPolicy>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ProductPolicy, Document<unknown, {}, ProductPolicy, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ProductPolicy & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    name?: import("mongoose").SchemaDefinitionProperty<string, ProductPolicy, Document<unknown, {}, ProductPolicy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProductPolicy & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    productDetails?: import("mongoose").SchemaDefinitionProperty<string, ProductPolicy, Document<unknown, {}, ProductPolicy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProductPolicy & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    shippingAndReturns?: import("mongoose").SchemaDefinitionProperty<string, ProductPolicy, Document<unknown, {}, ProductPolicy, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProductPolicy & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, ProductPolicy>;
