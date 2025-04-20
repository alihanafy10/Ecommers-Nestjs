import { Body, Controller, Get, Param, Patch, Post, Put, Query, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";

import { CouponService } from "./coupon.service";
import { Auth } from "../../common/decorator";
import { UserType } from "../../common/shared";
import { ZodValidationPipe } from "../../common/pipes";
import { createCouponBodyDto, getAllCouponQueryDto, getCouponParamsDto, patchCouponBodyDto, patchCouponParamsDto, updateCouponBodyDto } from "./dto";
import { TcreateCouponBodyDto, TgetAllCouponQueryDto, TgetCouponParamsDto, TpatchCouponBodyDto, TpatchCouponParamsDto, TupdateCouponBodyDto } from "../../common/types";

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post('')
  @Auth([UserType.ADMIN])
  async createCoupon(
    @Req() req: Request,
    @Res() res: Response,
    @Body(new ZodValidationPipe(createCouponBodyDto)) body: TcreateCouponBodyDto,
  ): Promise<Response> {
    const data = await this.couponService.createCoupon(body, req);
    return res.status(201).json({ message: 'created successfully', data });
  }
  @Get(':_id')
  @Auth([UserType.ADMIN])
  async getCouponById(
    @Res() res: Response,
    @Param(new ZodValidationPipe(getCouponParamsDto)) Param: TgetCouponParamsDto,
  ): Promise<Response> {
    const data = await this.couponService.getCouponById( Param._id);
    return res.status(200).json({ message: 'success', data });
  }

  @Get('')
  @Auth([UserType.ADMIN])
  async getAllCoupon(
    @Res() res: Response,
    @Query(new ZodValidationPipe(getAllCouponQueryDto)) query: TgetAllCouponQueryDto,
  ): Promise<Response> {
    const data = await this.couponService.getAllCoupon( query);
    return res.status(200).json({ message: 'success', data });
  }

  @Patch(':_id')
  @Auth([UserType.ADMIN])
  async enableOrDisableCoupon(
    @Req() req: Request,
    @Res() res: Response,
    @Body(new ZodValidationPipe(patchCouponBodyDto)) body: TpatchCouponBodyDto,
    @Param(new ZodValidationPipe(patchCouponParamsDto)) param: TpatchCouponParamsDto,
  ): Promise<Response> {
    const data = await this.couponService.enableOrDisableCoupon( body.isEnable,param._id,req);
    return res.status(201).json({ message: 'success', data });
  }

  @Put(':_id')
  @Auth([UserType.ADMIN])
  async updateCoupon(
    @Req() req: Request,
    @Res() res: Response,
    @Body(new ZodValidationPipe(updateCouponBodyDto)) body: TupdateCouponBodyDto,
    @Param(new ZodValidationPipe(patchCouponParamsDto)) param: TpatchCouponParamsDto,
  ): Promise<Response> {
    const data = await this.couponService.updateCoupon( body,param,req);
    return res.status(201).json({ message: 'success', data });
  }
}