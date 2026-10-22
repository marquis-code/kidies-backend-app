import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order, OrderSchema } from './schemas/order.schema';
import { AuthModule } from '../auth/auth.module';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { PaystackController } from './paystack.controller';
import { StripeController } from './stripe.controller';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { Coupon, CouponSchema } from '../coupons/coupon.schema';
import { Setting, SettingSchema } from '../settings/schemas/setting.schema';

@Module({
  imports: [
    AuditLogsModule,
    AuthModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Coupon.name, schema: CouponSchema },
      { name: Setting.name, schema: SettingSchema },
    ]),
  ],
  controllers: [OrdersController, PaystackController, StripeController],
  providers: [OrdersService],
})
export class OrdersModule {}
