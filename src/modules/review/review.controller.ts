import { Body, Controller, Get, Param, Patch, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";

import { ReviewService } from "./review.service";
import { Auth } from "../../common/decorator";
import { UserType } from "../../common/shared";
import { ZodValidationPipe } from "../../common/pipes";
import { addReviewBodyDto, updateReviewBodyDto, updateReviewParamsDto } from "./dto";
import { TaddReviewBodyDto, TupdateReviewBodyDto, TupdateReviewParamsDto } from "../../common/types";

@Controller('review')
export class ReviewController{
    constructor(
        private readonly reviewServise:ReviewService
    ){}

    @Post('')
         @Auth([UserType.ADMIN,UserType.BUYER])
          async addReview(
            @Req() req: Request,
            @Res() res: Response,
            @Body(new ZodValidationPipe(addReviewBodyDto)) body: TaddReviewBodyDto,
          ): Promise<Response> {
            const data = await this.reviewServise.addReview( body,req);
            return res.status(201).json({ message: 'added success', data });
          }

            @Get('')
               @Auth([UserType.ADMIN])
                async getAllOredrs(
                  @Res() res: Response,
                ): Promise<Response> {
                  const data = await this.reviewServise.listReview();
                  return res.status(200).json({ message: 'success', data });
                }
            @Patch(':_id')
               @Auth([UserType.ADMIN])
                async acceptOrRejectReview(
                  @Res() res: Response,
                  @Body(new ZodValidationPipe(updateReviewBodyDto)) body: TupdateReviewBodyDto,
                  @Param(new ZodValidationPipe(updateReviewParamsDto)) param: TupdateReviewParamsDto,
                ): Promise<Response> {
                  const data = await this.reviewServise.acceptOrRejectReview(body,param);
                  return res.status(201).json({ message: 'success', data });
                }
}