
import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Date } from "mongoose";
import { CouponType } from "../shared";
import { UsersCoupon } from "./interface";





@Schema({ timestamps: true })
export class Coupon {
 @Prop({
    type:String,
    required:true,
 })
 name:string;

 @Prop({
    type: Number,
    required: true,
 })
 couponAmount:number;

 @Prop({
    type: String,
    required: true,
    enum:Object.values(CouponType)
 })
 couponType:string;

 @Prop({
    type: Date,
    required: true,
 })
 from:Date;

 @Prop({
    type: Date,
    required: true,
 })
 to:Date;

 @Prop([
    {
        userId:{
             type: mongoose.Schema.Types.ObjectId,
              ref: 'User', required: true
        },
        maxCount:{
            type: Number,
            required: true,
            min: 1,
        },
        useageCount:{
            type: Number,
          default: 0,
        }
    }
 ])
 users:UsersCoupon[];

 @Prop({
    type: Boolean,
    default: true,
 })
 isEnable:boolean;

 @Prop({
    type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
 })
 createdBy:mongoose.Schema.Types.ObjectId


}

const couponSchema = SchemaFactory.createForClass(Coupon)

export const CouponModel=MongooseModule.forFeature([{name:Coupon.name,schema:couponSchema}])


@Schema({ timestamps: true })
export class LogsCoupon{
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Coupon",
    })
    couponId:mongoose.Schema.Types.ObjectId;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref:"User"
     })
     createdBy:mongoose.Schema.Types.ObjectId;

     @Prop({
        type: Object,
      required: true,
     })
     changes:Object;

}

const logsCouponSchema = SchemaFactory.createForClass(LogsCoupon)

export const LogsCouponModel=MongooseModule.forFeature([{name:LogsCoupon.name,schema:logsCouponSchema}])