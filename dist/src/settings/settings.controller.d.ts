import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
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
    updateStorefrontSettings(payload: any, req: any): Promise<import("./schemas/setting.schema").StorefrontSettings>;
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
}
