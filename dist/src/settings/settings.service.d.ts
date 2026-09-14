import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { SettingDocument } from './schemas/setting.schema';
export declare class SettingsService implements OnModuleInit {
    private settingModel;
    constructor(settingModel: Model<SettingDocument>);
    onModuleInit(): Promise<void>;
    getStorefrontSettings(): Promise<{}>;
    updateStorefrontSettings(payload: any): Promise<import("./schemas/setting.schema").StorefrontSettings>;
}
