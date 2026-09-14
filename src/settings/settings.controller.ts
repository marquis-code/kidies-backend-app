import { Controller, Get, Put, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('storefront')
  async getStorefrontSettings() {
    return this.settingsService.getStorefrontSettings();
  }

  @Put('storefront')
  async updateStorefrontSettings(@Body() payload: any) {
    return this.settingsService.updateStorefrontSettings(payload);
  }
}
