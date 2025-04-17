import { Module } from "@nestjs/common";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { CartModel, ProductModel, UserModel } from "../../common/schemas";
import { JwtService } from "@nestjs/jwt";


@Module({
  imports: [CartModel,ProductModel,UserModel],
  controllers: [CartController],
  providers: [CartService,JwtService],
})
export class CartModule{}