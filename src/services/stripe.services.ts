import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Coupon } from "../common/schemas";

@Injectable()
export class StripeService{
    constructor(@InjectModel(Coupon.name) private couponModel: Model<Coupon>,) {}

        
}