import { BadRequestException, Injectable } from "@nestjs/common";
import { Request } from "express";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { TaddReviewBodyDto, TupdateReviewBodyDto, TupdateReviewParamsDto } from "../../common/types";
import { Order, Product, Review } from "../../common/schemas";
import { OrderStatusType, ReviewStatus } from "../../common/shared";

@Injectable()
export class ReviewService{
      constructor(
        @InjectModel(Review.name) private reviewModel: Model<Review>,
        @InjectModel(Product.name) private productModel: Model<Product>,
        @InjectModel(Order.name) private orderModel: Model<Order>,
      
      ) {}
      /**
       * 
       * @param {TaddReviewBodyDto}body 
       * @param {Request|any}req 
       * @returns {Review}
       */
    async addReview(body:TaddReviewBodyDto,req:Request|any):Promise<Review>{
        const userId = req.authUser._id;
        const { productId, reviewRating, rewiewBody } = body

           //check if user already reviewed
    const isAlreadyReviewed = await this.reviewModel.findOne({
        userId,
        productId,
    })
    if (isAlreadyReviewed)throw new BadRequestException("Already reviewed")
        //check if product exists 
    const product = await this.productModel.findById(productId)
    if (!product) throw new BadRequestException("Product not found")

         //check if user bought this product
    const isBought = await this.orderModel.findOne({
        userId,
        "products.productId": productId,
        orderStatus: OrderStatusType.DELIVERED,
      });
      if (!isBought)throw new BadRequestException("you must buy this product first")
        const reviewObj = {
            userId,
            productId,
            reviewRating,
            rewiewBody,
          };
          const newRev = await this.reviewModel.create(reviewObj)
          return newRev
    }

    /**
     * 
     * @returns {Review[]}
     */
    async listReview():Promise<Review[]>{
        const review = await this.reviewModel.find().populate(
            [
                {
                    path: 'userId',
                    select:'userName email -_id'
                },
                {
                    path: 'productId',
                    select:'title rating -_id'
                }
            ]
        )
        return review
    }

    /**
     * 
     * @param {TupdateReviewBodyDto}body 
     * @param {TupdateReviewParamsDto}param 
     * @returns {Review}
     */
    async acceptOrRejectReview(body:TupdateReviewBodyDto,param:TupdateReviewParamsDto):Promise<Review>{
        const { _id } = param
        const { accept, reject } = body
        if (accept && reject)throw new BadRequestException("please select accept or reject")

            const review = await this.reviewModel.findByIdAndUpdate(_id, {
                reviewStatus:accept?ReviewStatus.ACCEPTD:reject?ReviewStatus.REJECTED:ReviewStatus.PENDING,
              },{new:true});
              return review
    }
}