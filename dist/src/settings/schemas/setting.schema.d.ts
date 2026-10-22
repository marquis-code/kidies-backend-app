import { Document } from 'mongoose';
export type SettingDocument = Setting & Document;
export declare class HeroCarouselItem {
    imageUrl: string;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
}
export declare class FeaturedCategory {
    title: string;
    imageUrl: string;
    link: string;
}
export declare class StorefrontSettings {
    heroCarousel: HeroCarouselItem[];
    featuredCategories: FeaturedCategory[];
    brandStory: {
        section1Title: string;
        section1Text: string;
        section2Title: string;
        section2Text: string;
        section3Title: string;
        section3Text: string;
    };
}
export declare class Setting {
    key: string;
    storefront: StorefrontSettings;
    general: {
        storeName?: string;
        storeEmail?: string;
        phone?: string;
        address?: string;
        currency?: string;
        shippingFee?: number;
        freeShippingThreshold?: number;
        taxRate?: number;
        instagram?: string;
        facebook?: string;
        twitter?: string;
        announcement?: string;
    };
}
export declare const SettingSchema: import("mongoose").Schema<Setting, import("mongoose").Model<Setting, any, any, any, any, any, Setting>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Setting, Document<unknown, {}, Setting, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Setting & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    key?: import("mongoose").SchemaDefinitionProperty<string, Setting, Document<unknown, {}, Setting, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Setting & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    storefront?: import("mongoose").SchemaDefinitionProperty<StorefrontSettings, Setting, Document<unknown, {}, Setting, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Setting & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    general?: import("mongoose").SchemaDefinitionProperty<{
        storeName?: string;
        storeEmail?: string;
        phone?: string;
        address?: string;
        currency?: string;
        shippingFee?: number;
        freeShippingThreshold?: number;
        taxRate?: number;
        instagram?: string;
        facebook?: string;
        twitter?: string;
        announcement?: string;
    }, Setting, Document<unknown, {}, Setting, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Setting & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Setting>;
