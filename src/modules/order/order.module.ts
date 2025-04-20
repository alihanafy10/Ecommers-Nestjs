import { JwtService } from "@nestjs/jwt";
import { Module } from "@nestjs/common";

import { AddressModel, CartModel, CouponModel, OrderModel, ProductModel, UserModel } from "../../common/schemas";
import { CheakExisit, QrCodeService, ValidateCoupon } from "../../services";
import { OrderController } from "./oredr.controller";
import { OredrService } from "./order.service";

@Module({
  imports: [ProductModel,UserModel,CouponModel,OrderModel,CartModel,AddressModel],
  controllers: [OrderController],
  providers: [OredrService,ValidateCoupon,QrCodeService,JwtService],
})
export class OrderModule{}