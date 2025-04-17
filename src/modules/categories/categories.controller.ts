import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { query, Request, Response } from "express";

import { CategoriesService } from "./categories.service";
import { Auth } from "../../common/decorator";
import { UserType } from "../../common/shared";
import { ZodValidationPipe } from "../../common/pipes";
import { createCategoriesBodyDto, getAllCategorieQueryDto, getCategorieQueryDto, updateCategoriesBodyDto, updateCategoriesParamsDto } from "./dto";
import { TcreateCategoriesBodyDto, TgetAllCategorieQueryDto, TgetCategorieQueryDto, TupdateCategoriesBodyDto, TupdateCategoriesParamsDto } from "../../common/types";
import { createFileUploadPipe } from '../../common/utils';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService:CategoriesService) {}

    @Post('create')
    @UseInterceptors(FileInterceptor('image'))
    @Auth([ UserType.ADMIN])
    async createCategories(
        @Req() req: Request,
        @Res() res: Response,
        @Body(new ZodValidationPipe(createCategoriesBodyDto)) body:TcreateCategoriesBodyDto ,
        @UploadedFile() file: Express.Multer.File,
      ): Promise<Response> {
      //If the file exists from it via => createFileUploadPipe
      if (file) {
        await createFileUploadPipe().transform(file);
      }

        const data = await this.categoriesService.createCategories(body, req, file);
        return res.status(201).json({ message: 'created successfully', data });
      }

      @Put('update/:_id')
      @UseInterceptors(FileInterceptor('image'))
      @Auth([ UserType.ADMIN])
      async updateCategories(
        @Res() res: Response,
        @Body(new ZodValidationPipe(updateCategoriesBodyDto)) body:TupdateCategoriesBodyDto ,
        @Param(new ZodValidationPipe(updateCategoriesParamsDto)) param: TupdateCategoriesParamsDto,
        @UploadedFile() file?: Express.Multer.File,
      ){
        //If the file exists from it via => createFileUploadPipe
    if (file) {
      await createFileUploadPipe().transform(file);
    }

    const data = await this.categoriesService.updateCategories(body, param, file);
    return res.status(201).json({ message: 'updated successfully', data });
      }

      @Get()
      @Auth([ UserType.ADMIN , UserType.BUYER])
      async getCategorie(
        @Query(new ZodValidationPipe(getCategorieQueryDto)) query:TgetCategorieQueryDto,
        @Res() res: Response,
      ): Promise<Response> {
        const data = await this.categoriesService.getCategorie(query);
        return res.status(200).json({ message:'success',data });
      }
      
      @Get('allCategories')
      @Auth([ UserType.ADMIN , UserType.BUYER])
      async getAllCategories(
        @Query(new ZodValidationPipe(getAllCategorieQueryDto)) query:TgetAllCategorieQueryDto,
        @Res() res: Response,
      ): Promise<Response> {
        const data = await this.categoriesService.getAllCategorie(query);
        return res.status(200).json({ message:'success',data });
      }

      @Delete(':_id')
      @Auth([ UserType.ADMIN])
      async deleteCategories(
        @Param(new ZodValidationPipe(updateCategoriesParamsDto)) param: TupdateCategoriesParamsDto,
        @Res() res: Response,
      ): Promise<Response> {
         await this.categoriesService.deleteCategories(param._id);
        return res.status(200).json({ message:'deleted successfully' });
      }


}