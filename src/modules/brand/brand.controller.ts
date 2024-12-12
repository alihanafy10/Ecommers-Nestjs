import { Body, Controller, Get, Param, Post, Put, Query, Req, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";

import { BrandService } from "./brand.service";
import { Auth } from "../../common/decorator";
import { UserType } from "../../common/shared";
import { ZodValidationPipe } from "../../common/pipes";
import { createBrandBodyDto, getBrandQueryDto, updateBrandBodyDto, updateBrandParamsDto } from "./dto";
import { TcreateBrandBodyDto, TgetBrandQueryDto, TupdateBrandBodyDto, TupdateBrandParamsDto } from "../../common/types/brand.types";
import { createFileUploadPipe } from "../../common/utils";




@Controller('brand')
export class BrandController {
    constructor(private readonly brandService:BrandService) {}
    
    @Post('create')
    @UseInterceptors(FileInterceptor('image'))
    @Auth([ UserType.ADMIN])
    async createBrand(
        @Req() req: Request,
        @Res() res: Response,
        @Body(new ZodValidationPipe(createBrandBodyDto)) body:TcreateBrandBodyDto ,
        @UploadedFile() file: Express.Multer.File,
      ): Promise<Response> {
      //If the file exists from it via => createFileUploadPipe
      if (file) {
        await createFileUploadPipe().transform(file);
      }

        const data = await this.brandService.createBrand(body, req, file);
        return res.status(201).json({ message: 'created successfully', data });
      }

      @Put(':_id')
      @UseInterceptors(FileInterceptor('image'))
      @Auth([ UserType.ADMIN])
      async updateBrand(
        @Res() res: Response,
        @Body(new ZodValidationPipe(updateBrandBodyDto)) body:TupdateBrandBodyDto ,
        @Param(new ZodValidationPipe(updateBrandParamsDto)) param: TupdateBrandParamsDto,
        @UploadedFile() file?: Express.Multer.File,
      ){
        //If the file exists from it via => createFileUploadPipe
    if (file) {
      await createFileUploadPipe().transform(file);
    }

    const data = await this.brandService.updateBrand(body, param, file);
    return res.status(201).json({ message: 'updated successfully', data });
      }

      @Get()
      @Auth([ UserType.ADMIN , UserType.BUYER])
      async getBrand(
        @Query(new ZodValidationPipe(getBrandQueryDto)) query:TgetBrandQueryDto,
        @Res() res: Response,
      ): Promise<Response> {
        const data = await this.brandService.getBrand(query);
        return res.status(200).json({ message:'success',data });
      }

}