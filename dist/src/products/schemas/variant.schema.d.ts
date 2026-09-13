import { Document, Types } from 'mongoose';
export type VariantDocument = Variant & Document;
export declare class Variant {
    productId: Types.ObjectId;
    sku: string;
    color: string;
    size: string;
    material: string;
    priceModifier: number;
    image: {
        cloudinaryPublicId: string;
        thumbnailUrl: string;
        mediumUrl: string;
    };
    isActive: boolean;
}
export declare const VariantSchema: import("mongoose").Schema<Variant, import("mongoose").Model<Variant, any, any, any, any, any, Variant>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Variant, Document<unknown, {}, Variant, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Variant & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    productId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Variant, Document<unknown, {}, Variant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Variant & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    sku?: import("mongoose").SchemaDefinitionProperty<string, Variant, Document<unknown, {}, Variant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Variant & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    color?: import("mongoose").SchemaDefinitionProperty<string, Variant, Document<unknown, {}, Variant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Variant & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    size?: import("mongoose").SchemaDefinitionProperty<string, Variant, Document<unknown, {}, Variant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Variant & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    material?: import("mongoose").SchemaDefinitionProperty<string, Variant, Document<unknown, {}, Variant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Variant & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    priceModifier?: import("mongoose").SchemaDefinitionProperty<number, Variant, Document<unknown, {}, Variant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Variant & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    image?: import("mongoose").SchemaDefinitionProperty<{
        cloudinaryPublicId: string;
        thumbnailUrl: string;
        mediumUrl: string;
    }, Variant, Document<unknown, {}, Variant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Variant & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Variant, Document<unknown, {}, Variant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Variant & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Variant>;
