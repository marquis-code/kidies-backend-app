import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { SettingDocument } from './schemas/setting.schema';
export declare const DEFAULT_GENERAL_SETTINGS: {
    storeName: string;
    storeEmail: string;
    phone: string;
    address: string;
    currency: string;
    shippingFee: number;
    freeShippingThreshold: number;
    taxRate: number;
    instagram: string;
    facebook: string;
    twitter: string;
    announcement: string;
};
export declare class SettingsService implements OnModuleInit {
    private settingModel;
    constructor(settingModel: Model<SettingDocument>);
    onModuleInit(): Promise<void>;
    getStorefrontSettings(): Promise<{
        heroCarousel: import("./schemas/setting.schema").HeroCarouselItem[];
        featuredCategories: import("./schemas/setting.schema").FeaturedCategory[];
        brandStory: {
            section1Title: string;
            section1Text: string;
            section2Title: string;
            section2Text: string;
            section3Title: string;
            section3Text: string;
        };
    }>;
    updateStorefrontSettings(payload: any): Promise<import("./schemas/setting.schema").StorefrontSettings>;
    getGeneralSettings(): Promise<{
        storeName: string;
        storeEmail: string;
        phone: string;
        address: string;
        currency: string;
        shippingFee: number;
        freeShippingThreshold: number;
        taxRate: number;
        instagram: string;
        facebook: string;
        twitter: string;
        announcement: string;
    }>;
    updateGeneralSettings(payload: any): Promise<{
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
    }>;
    getAll(): Promise<{
        storefront: {
            heroCarousel: import("./schemas/setting.schema").HeroCarouselItem[];
            featuredCategories: import("./schemas/setting.schema").FeaturedCategory[];
            brandStory: {
                section1Title: string;
                section1Text: string;
                section2Title: string;
                section2Text: string;
                section3Title: string;
                section3Text: string;
            };
        };
        general: {
            storeName: string;
            storeEmail: string;
            phone: string;
            address: string;
            currency: string;
            shippingFee: number;
            freeShippingThreshold: number;
            taxRate: number;
            instagram: string;
            facebook: string;
            twitter: string;
            announcement: string;
        };
    }>;
}
