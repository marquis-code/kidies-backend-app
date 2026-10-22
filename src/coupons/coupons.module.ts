import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';
import { Coupon, CouponSchema } from './coupon.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }])],
  controllers: [CouponsController],
  providers: [CouponsService]
})
export class CouponsModule {}
