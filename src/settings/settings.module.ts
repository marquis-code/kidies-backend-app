import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { Setting, SettingSchema } from './schemas/setting.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,MongooseModule.forFeature([{ name: Setting.name, schema: SettingSchema }])],
  providers: [SettingsService],
  controllers: [SettingsController]
})
export class SettingsModule {}
