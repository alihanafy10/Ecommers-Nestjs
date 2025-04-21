import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { SubCategoriesModule } from './modules/subCategories/subCategories.module';
import { BrandModule } from './modules/brand/brand.module';
import { ProductModule } from './modules/product/product.module';
import { CartModule } from './modules/cart/cart.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { OrderModule } from './modules/order/order.module';
import { ReviewModule } from './modules/review/review.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.${process.env.NODE_ENV}.env`, '.env'],
    }),
    MongooseModule.forRoot(process.env.MONGOOSE_URI),
    AuthModule,
    UserModule,
    CategoriesModule,
    SubCategoriesModule,
    BrandModule,
    ProductModule,
    CartModule,
    CouponModule,
    OrderModule,
    ReviewModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
