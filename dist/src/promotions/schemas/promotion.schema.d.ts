import { Document } from 'mongoose';
export type PromotionDocument = Promotion & Document;
export declare class Promotion {
    title: string;
    subtitle: string;
    type: string;
    imageUrl: string;
    backgroundColor: string;
    ctaText: string;
    ctaLink: string;
    isActive: boolean;
    categoryTarget: string;
    startDate: Date;
    endDate: Date;
}
export declare const PromotionSchema: import("mongoose").Schema<Promotion, import("mongoose").Model<Promotion, any, any, any, any, any, Promotion>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Promotion, Document<unknown, {}, Promotion, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Promotion & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    title?: import("mongoose").SchemaDefinitionProperty<string, Promotion, Document<unknown, {}, Promotion, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Promotion & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    subtitle?: import("mongoose").SchemaDefinitionProperty<string, Promotion, Document<unknown, {}, Promotion, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Promotion & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<string, Promotion, Document<unknown, {}, Promotion, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Promotion & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    imageUrl?: import("mongoose").SchemaDefinitionProperty<string, Promotion, Document<unknown, {}, Promotion, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Promotion & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    backgroundColor?: import("mongoose").SchemaDefinitionProperty<string, Promotion, Document<unknown, {}, Promotion, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Promotion & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    ctaText?: import("mongoose").SchemaDefinitionProperty<string, Promotion, Document<unknown, {}, Promotion, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Promotion & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    ctaLink?: import("mongoose").SchemaDefinitionProperty<string, Promotion, Document<unknown, {}, Promotion, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Promotion & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Promotion, Document<unknown, {}, Promotion, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Promotion & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    categoryTarget?: import("mongoose").SchemaDefinitionProperty<string, Promotion, Document<unknown, {}, Promotion, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Promotion & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    startDate?: import("mongoose").SchemaDefinitionProperty<Date, Promotion, Document<unknown, {}, Promotion, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Promotion & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    endDate?: import("mongoose").SchemaDefinitionProperty<Date, Promotion, Document<unknown, {}, Promotion, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Promotion & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Promotion>;
