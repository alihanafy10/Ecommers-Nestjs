import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DateTime } from "luxon"

import { Coupon } from "../common/schemas";
import { DiscountType } from "../common/shared";

@Injectable()
export class ValidateCoupon{
    constructor(@InjectModel(Coupon.name) private couponModel: Model<Coupon>,) {}

      async validateCoupon(name:string,userId:string):Promise<Coupon>{
        //get coupon by coupon code
        const coupon:Coupon|any = await this.couponModel.findOne({ name })
        if(!coupon)throw new BadRequestException("coupon not found")

        //check coupon is enable
    if (!coupon.isEnable)throw new BadRequestException("Coupon is not enabled")

         //check coupon is expired
    if(DateTime.now() > DateTime.fromJSDate(coupon.to))throw new BadRequestException("Coupon expired")

    //check coupon is not started
    if(DateTime.now() < DateTime.fromJSDate(coupon.from))throw new BadRequestException(`Coupon not started yet it starts ${coupon.from}`)


         //check if user not eligible for coupon
    const isUserNoteligible=coupon.users.findIndex((ele:any)=>ele.userId.toString() == userId.toString())
    
    if(isUserNoteligible==-1)throw new BadRequestException("user not eligible for coupon")
    if (coupon.users[isUserNoteligible].maxCount <=coupon.users[isUserNoteligible].useageCount)throw new BadRequestException("The number of times you have used the coupon has run out")

        //return
        return coupon
        }
       applyCoupon(subTotal:number,coupon:Coupon):number{
        let total = subTotal;
        const { couponAmount, couponType } = coupon;
      if (couponType == DiscountType.PERCENT) {
        total = subTotal - (subTotal * couponAmount) / 100;
      } else if (couponType == DiscountType.FIXED) {
          if (couponAmount > subTotal) {
              return total
          }
              total = subTotal - couponAmount;
      }
      return total;
      }
}