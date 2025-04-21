import { JwtService } from "@nestjs/jwt";
import { Module } from "@nestjs/common";

import {  OrderModel, ProductModel, ReviewModel, UserModel } from "../../common/schemas";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";


@Module({
  imports: [ReviewModel,ProductModel,OrderModel,UserModel],
  controllers: [ReviewController],
  providers: [ReviewService,JwtService],
})
export class ReviewModule{}