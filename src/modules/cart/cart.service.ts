import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Request } from "express";



import {   Cart, Product } from "../../common/schemas";
import { TaddToCartBodyDto } from "../../common/types";





@Injectable()

export class CartService {
    
    constructor(
        @InjectModel(Cart.name) private cartModel: Model<Cart>,
        @InjectModel(Product.name) private productModel: Model<Product>,
      
      ) {}


      /**
       * 
       * @param {TaddToCartBodyDto}body 
       * @param {Request|any}req 
       * @throws {BadRequestException} -product not found
       * @throws {BadRequestException} -product already exists
       * @returns {Cart}
       */
      async addToCart(body:TaddToCartBodyDto,req:Request|any):Promise<Cart>{
        //featch data
        const {productId,quantity}=body
        const userId=req.authUser._id
        
        //check if product found
        const product =await this.productModel.findOne({_id:productId,stock:{$gte:quantity}})
        if(!product)throw new BadRequestException("product not found")
        
        const cart:Cart|any=await this.cartModel.findOne({userId})
        if(!cart){
            const newCart=new this.cartModel({
                userId,
                products:[{
                    productId:product._id,
                    quantity,
                    price:product.appliedPrice
                }]
            })
           const data= await newCart.save()
            return data
        }
        //cheack if product in cart
        const isProductExist = cart.products.find((p:any) => p.productId == productId)
        console.log(isProductExist);
        
        if(isProductExist) throw new BadRequestException("product already exists")
            
            cart.products.push({
              productId: product._id,
              quantity,
              price: product.appliedPrice,
            });
        await cart.save()
        return cart
      }

      /**
       * 
       * @param {TaddToCartBodyDto}body 
       * @param {Request|any}req 
       * @throws {BadRequestException} -product not avilable for this quantity
       * @throws {BadRequestException} -product not in cart
       * @returns {Cart}
       */
      async updateCart(body:TaddToCartBodyDto,req:Request|any):Promise<Cart>{
         //featch data
         const {productId,quantity}=body
         const userId=req.authUser._id
         //cheack if quantity of product avilable
         const isStokless=await this.productModel.findOne({_id:productId,stock:{$gte:quantity}})
         if (!isStokless) throw new BadRequestException("product not avilable for this quantity")

            //cheack if product in cart
            const cart:any = await this.cartModel.findOne({ userId, "products.productId": productId });
            if (!cart) throw new BadRequestException("product not in cart")
             //idx of product
                const idxproduct = cart.products.findIndex((p:any) => p.productId == productId);

                cart.products[idxproduct].quantity=quantity;
                const data=await cart.save()

         return data
      }

       /**
       * 
       * @param {string}productId 
       * @param {Request|any}req 
       * @throws {BadRequestException} -product not in cart
       * @returns {any}
       */
      async deleteFromCart(productId:string,req:Request|any):Promise<any>{
        const userId=req.authUser._id
        //cheack if product in cart
        const cart:any = await this.cartModel.findOne({ userId, 'products.productId': productId })
        if(!cart)throw new BadRequestException("product not in cart")

            cart.products = cart.products.filter((p:any)=>p.productId != productId);
            await cart.save()
          return cart.products.length  ? 
          { message: "deleted succsses", data:cart }
          :{ message: "deleted succsses" }
      }

      /**
       * 
       * @param {Request|any}req 
       * @throws {BadRequestException} - can not delete cart
       */
      async deleteCart(req:Request|any):Promise<void>{
        const userId=req.authUser._id

        const data=await this.cartModel.deleteOne({userId})
        if(!data.deletedCount)throw new BadRequestException("can not delete cart")
      }
      /**
       * 
       * @param {Request|any}req 
       * @throws {BadRequestException} - cart not found
       * @returns {Cart}
       */
      async getCart(req:Request|any):Promise<Cart>{
        const userId=req.authUser._id

        const data=await this.cartModel.findOne({userId})
        if(!data)throw new BadRequestException("cart not found")
            return data
      }
 

   
}