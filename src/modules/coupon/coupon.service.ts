import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Request } from "express";
import  { Model } from "mongoose";


import { Coupon, LogsCoupon, User } from "../../common/schemas";
import { CheakExisit } from "../../services";
import { TcreateCouponBodyDto, TgetAllCouponQueryDto, TpatchCouponParamsDto, TupdateCouponBodyDto } from "../../common/types";

@Injectable()
export class CouponService{
constructor(
      @InjectModel(Coupon.name) private couponModel: Model<Coupon>,
      @InjectModel(LogsCoupon.name) private logsCouponModel: Model<LogsCoupon>,
      @InjectModel(User.name) private userModel: Model<User>,
      private readonly cheakExisit:CheakExisit
){}

/**
 * 
 * @param {TcreateCouponBodyDto}body 
 * @param {Request|any}req 
 * 
 * @throws {BadRequestException} -name alrady exisit
 * @throws {BadRequestException} -Invalid users
 *
 * @returns {Coupon}
 */
    async createCoupon(body:TcreateCouponBodyDto,req:Request|any):Promise<Coupon>{
        const { name, couponAmount, couponType, from, to, users } = body
          //coupon code check
          await this.cheakExisit.cheakExisit(this.couponModel,name)

          //users check
          const userIds:string[]=users.map(e=>e.userId)
          //validate user
          const validateUser=await this.userModel.find({_id:{$in:userIds}})
          if(userIds.length!=validateUser.length)throw new BadRequestException("Invalid users")
            //create coupon obj
        const newCoupon=new this.couponModel({
            name,
            couponAmount,
            couponType,
            from,
            to,
            users,
            createdBy:req.authUser._id
        })        
         await newCoupon.save()
         return newCoupon

    }

/**
 * 
 * @param {string}_id 
 *  @throws {BadRequestException} -coupon not found
 * @returns {Coupon}
 */
    async getCouponById(_id:string):Promise<Coupon>{
        const coupon=await this.couponModel.findById(_id)
        if(!coupon)throw new BadRequestException("coupon not found")
            return coupon
    }

    /**
     * 
     * @param {TgetAllCouponQueryDto}isEnable 
     * @returns {Coupon[]}
     */
    async getAllCoupon(isEnable:TgetAllCouponQueryDto):Promise<Coupon[]>{
        const filters:any={}
        if(isEnable.isEnable){
            filters.isEnable=isEnable.isEnable==="true"
        }
        const data=await this.couponModel.find(filters)
        return data
        
    }
    
    /**
     * 
     * @param {boolean}isEnable 
     * @param {string}_id 
     * @param {Request|any}req 
     * 
     * @throws {BadRequestException} -coupon not found
     * 
     * @returns { coupon: Coupon; logs: LogsCoupon }
     */
    async enableOrDisableCoupon(isEnable:boolean,_id:string,req:Request|any):Promise<{ coupon: Coupon; logs: LogsCoupon }>{
        //cheack if coupon exisit
        const coupon:Coupon|any=await this.couponModel.findById(_id)
        if(!coupon)throw new BadRequestException("coupon not found")

            //obj logs
            const logsCoupon:LogsCoupon|any={couponId:coupon._id,createdBy:req.authUser._id,changes:{}}
            if(isEnable){
                coupon.isEnable=true
                logsCoupon.changes.isEnable=true
            }
            if(!isEnable){
                coupon.isEnable=false
                logsCoupon.changes.isEnable=false
            }
            //save
            await coupon.save()
            const logs=await new this.logsCouponModel(logsCoupon).save()
            return {coupon,logs} 
    }


     /**
     * 
     * @param {TupdateCouponBodyDto}body 
     * @param {TpatchCouponParamsDto}param 
     * @param {Request|any}req 
     * 
     * @throws {BadRequestException} -coupon not found
     * @throws {BadRequestException} -name alrady exisit
     * @throws {BadRequestException} -Invalid users
     * 
     * @returns { coupon: Coupon; logs: LogsCoupon }
     */
    async updateCoupon(body:TupdateCouponBodyDto,param:TpatchCouponParamsDto,req:Request|any):Promise<{ coupon: Coupon; logs: LogsCoupon }>{
        const { name, couponAmount, couponType, from, to, users } = body
        const {_id}=param
        const userId=req.authUser._id

         //cheack if coupon exisit
         const coupon:Coupon|any=await this.couponModel.findById(_id)
         if(!coupon)throw new BadRequestException("coupon not found")

        //obj logs
        const logsCoupon:LogsCoupon|any={couponId:coupon._id,createdBy:userId,changes:{}}

        if(name){
             //coupon code check
          await this.cheakExisit.cheakExisit(this.couponModel,name)
          coupon.name=name
          logsCoupon.changes.name=name
        }
        if(couponAmount){
            coupon.couponAmount = couponAmount;
            logsCoupon.changes.couponAmount=couponAmount
        }
        if (couponType) {
            coupon.couponType = couponType
            logsCoupon.changes.couponType=couponType
          }
          if (from) {
            coupon.from = from
            logsCoupon.changes.from=from
          }
          if (to) {
            coupon.to = to
            logsCoupon.changes.to=to
          }
          if(users){
  //users check
  const userIds:string[]=users.map(e=>e.userId)
  //validate user
  const validateUser=await this.userModel.find({_id:{$in:userIds}})
  if(userIds.length!=validateUser.length)throw new BadRequestException("Invalid users")

    coupon.users = users
    logsCoupon.changes.users=users

          }

         //save
         await coupon.save()
         const logs=await new this.logsCouponModel(logsCoupon).save()
         return {coupon,logs} 
    }
}