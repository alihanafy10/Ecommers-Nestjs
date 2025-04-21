import { Body, Controller, Get, Post, Put, Query, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";

import { OredrService } from "./order.service";
import { Auth } from "../../common/decorator";
import { UserType } from "../../common/shared";
import { ZodValidationPipe } from "../../common/pipes";
import { cancelOrderBodyDto, createOrderBodyDto, getAllOredrQueryDto } from "./dto";
import { TcancelOrderBodyDto, TcreateOrderBodyDto, TgetAllOredrQueryDto } from "../../common/types";

@Controller('order')
export class OrderController{
    constructor(private readonly orederService:OredrService){}

    @Post('')
     @Auth([UserType.ADMIN,UserType.BUYER])
      async createOredr(
        @Req() req: Request,
        @Res() res: Response,
        @Body(new ZodValidationPipe(createOrderBodyDto)) body: TcreateOrderBodyDto,
      ): Promise<Response> {
        const data = await this.orederService.createOredr( body,req);
        return res.status(201).json({ message: 'create success', data });
      }
    @Put('cancel')
     @Auth([UserType.ADMIN,UserType.BUYER])
      async cancelOredr(
        @Req() req: Request,
        @Res() res: Response,
        @Body(new ZodValidationPipe(cancelOrderBodyDto)) body: TcancelOrderBodyDto,
      ): Promise<Response> {
        const data = await this.orederService.cancelOredr( body._id,req);
        return res.status(201).json({ message: 'cancel success', data });
      }
    @Put('delivered')
     @Auth([UserType.ADMIN])
      async deliveredOredr(
        @Req() req: Request,
        @Res() res: Response,
        @Body(new ZodValidationPipe(cancelOrderBodyDto)) body: TcancelOrderBodyDto,
      ): Promise<Response> {
        const data = await this.orederService.deliveredOredr( body._id,req);
        return res.status(201).json({ message: 'delivered success', data });
      }
    @Get('')
     @Auth([UserType.ADMIN,UserType.BUYER])
      async getAllOredrs(
        @Req() req: Request,
        @Res() res: Response,
        @Query(new ZodValidationPipe(getAllOredrQueryDto)) query: TgetAllOredrQueryDto,
      ): Promise<Response> {
        const data = await this.orederService.getAllOredrs(query);
        return res.status(200).json({ message: 'success', data });
      }
}