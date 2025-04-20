import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";

import { OredrService } from "./order.service";
import { Auth } from "../../common/decorator";
import { UserType } from "../../common/shared";
import { ZodValidationPipe } from "../../common/pipes";
import { createOrderBodyDto } from "./dto";
import { TcreateOrderBodyDto } from "../../common/types";

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
}