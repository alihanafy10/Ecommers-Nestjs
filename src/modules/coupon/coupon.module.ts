import { JwtService } from "@nestjs/jwt";
import { Module } from "@nestjs/common";

import { CouponService } from "./coupon.service";
import { CouponController } from "./coupon.controller";
import { CouponModel, LogsCouponModel, ProductModel, UserModel } from "../../common/schemas";
import { CheakExisit } from "../../services";

@Module({
  imports: [ProductModel,UserModel,CouponModel,LogsCouponModel],
  controllers: [CouponController],
  providers: [CouponService,JwtService,CheakExisit],
})
export class CouponModule{}