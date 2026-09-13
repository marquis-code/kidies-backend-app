import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubscribersModule } from './subscribers/subscribers.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { CategoriesModule } from './categories/categories.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { ProductPoliciesModule } from './product-policies/product-policies.module';
import { CouponsModule } from './coupons/coupons.module';
import { ReviewsModule } from './reviews/reviews.module';
import { PromotionsModule } from './promotions/promotions.module';
import { StoresModule } from './stores/stores.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://admin:adminpassword@localhost:27017/jasmarkids?authSource=admin',
      }),
    }),
    ProductsModule,
    OrdersModule,
    AuthModule,
    ChatModule,
    CategoriesModule,
    AuditLogsModule,
    ProductPoliciesModule,
    SubscribersModule,
    CouponsModule,
    ReviewsModule,
    PromotionsModule,
    StoresModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
