import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { Request, Response } from "express";

import { CartService } from "./cart.service";
import { UserType } from "../../common/shared";
import { Auth } from "../../common/decorator";
import { ZodValidationPipe } from "../../common/pipes";
import { addToCartBodyDto, deleteFromCartParamsDto } from "./dto";
import { TaddToCartBodyDto, TdeleteFromCartParamsDto } from "../../common/types";



@Controller('cart')
export class CartController {
    constructor(private readonly cartService:CartService) {}
    
  @Post('')
     
      @Auth([ UserType.ADMIN,UserType.BUYER])
      async createCart(
          @Req() req: Request,
          @Res() res: Response,
          @Body(new ZodValidationPipe(addToCartBodyDto)) body:TaddToCartBodyDto ,
        ): Promise<Response> {
       
  
          const data = await this.cartService.addToCart(body,req);
          return res.status(201).json({ message: 'added successfully', data });
        }

        @Put('')
        @Auth([ UserType.ADMIN,UserType.BUYER])
        async updateCart(
            @Req() req: Request,
            @Res() res: Response,
            @Body(new ZodValidationPipe(addToCartBodyDto)) body:TaddToCartBodyDto ,
        ){
            const data = await this.cartService.updateCart(body,req);
            return res.status(201).json({ message: 'updated successfully', data });
        }
        @Delete('/:productId')
        @Auth([ UserType.ADMIN,UserType.BUYER])
        async deleteFromCart(
            @Req() req: Request,
            @Res() res: Response,
            @Param(new ZodValidationPipe(deleteFromCartParamsDto)) param:TdeleteFromCartParamsDto ,
        ){
            const data = await this.cartService.deleteFromCart(param.productId,req);
            return res.status(201).json(data);
        }


        @Delete('')
        @Auth([ UserType.ADMIN,UserType.BUYER])
        async deleteCart(
            @Req() req: Request,
            @Res() res: Response,
        ){
             await this.cartService.deleteCart(req);
            return res.status(201).json({ message: 'deleted successfully'});
        }
        @Get('')
        @Auth([ UserType.ADMIN,UserType.BUYER])
        async getCart(
            @Req() req: Request,
            @Res() res: Response,
        ){
             const data=await this.cartService.getCart(req);
            return res.status(200).json({ message: 'successfully',data});
        }
}