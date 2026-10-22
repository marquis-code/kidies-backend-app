import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getAll() {
    return this.settingsService.getAll();
  }

  @Get('storefront')
  async getStorefrontSettings() {
    return this.settingsService.getStorefrontSettings();
  }

  @Get('general')
  async getGeneralSettings() {
    return this.settingsService.getGeneralSettings();
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Put('storefront')
  async updateStorefrontSettings(@Body() payload: any, @Req() req: any) {
    return this.settingsService.updateStorefrontSettings(payload);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Put('general')
  async updateGeneralSettings(@Body() payload: any) {
    return this.settingsService.updateGeneralSettings(payload);
  }
}
