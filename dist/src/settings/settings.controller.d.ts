import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getStorefrontSettings(): Promise<{}>;
    updateStorefrontSettings(payload: any): Promise<import("./schemas/setting.schema").StorefrontSettings>;
}
