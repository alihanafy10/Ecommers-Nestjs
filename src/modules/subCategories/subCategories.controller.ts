import {  Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";

import { subCategoriesService } from "./subCategories.service";
import { Auth } from "../../common/decorator";
import { UserType } from "../../common/shared";
import { ZodValidationPipe } from "../../common/pipes";
import { createFileUploadPipe } from "../../common/utils";
import { createSubCategoriesBodyDto, getAllSubCategoriesQueryDto, getSubCategorieQueryDto, updateSubCategoriesBodyDto, updateSubCategoriesParamsDto } from "./dto";
import { TcreateSubCategoriesBodyDto, TgetAllSubCategoriesQueryDto, TgetSubCategorieQueryDto, TupdateSubCategoriesBodyDto, TupdateSubCategoriesParamsDto } from "../../common/types";



@Controller('subCategories')
export class subCategoriesController {
    constructor(private readonly subcategoriesService:subCategoriesService) {}
    @Post('create')
    @UseInterceptors(FileInterceptor('image'))
    @Auth([ UserType.ADMIN])
    async createSubCategories(
        @Req() req: Request,
        @Res() res: Response,
        @Body(new ZodValidationPipe(createSubCategoriesBodyDto)) body:TcreateSubCategoriesBodyDto ,
        @UploadedFile() file: Express.Multer.File,
      ): Promise<Response> {
      //If the file exists from it via => createFileUploadPipe
      if (file) {
        await createFileUploadPipe().transform(file);
      }

        const data = await this.subcategoriesService.createSubCategories(body, req, file);
        return res.status(201).json({ message: 'created successfully', data });
      }

      @Put(':_id')
      @UseInterceptors(FileInterceptor('image'))
      @Auth([ UserType.ADMIN])
      async updateSubCategories(
        @Res() res: Response,
        @Body(new ZodValidationPipe(updateSubCategoriesBodyDto)) body:TupdateSubCategoriesBodyDto ,
        @Param(new ZodValidationPipe(updateSubCategoriesParamsDto)) param: TupdateSubCategoriesParamsDto,
        @UploadedFile() file?: Express.Multer.File,
      ){
        //If the file exists from it via => createFileUploadPipe
    if (file) {
      await createFileUploadPipe().transform(file);
    }

    const data = await this.subcategoriesService.updateSubCategories(body, param, file);
    return res.status(201).json({ message: 'updated successfully', data });
      }

      @Get()
      @Auth([ UserType.ADMIN , UserType.BUYER])
      async getSubCategorie(
        @Query(new ZodValidationPipe(getSubCategorieQueryDto)) query:TgetSubCategorieQueryDto,
        @Res() res: Response,
      ): Promise<Response> {
        const data = await this.subcategoriesService.getSubCategorie(query);
        return res.status(200).json({ message:'success',data });
      }

      @Get('allSubCategories')
      @Auth([ UserType.ADMIN , UserType.BUYER])
      async getAllSubCategories(
        @Query(new ZodValidationPipe(getAllSubCategoriesQueryDto)) query:TgetAllSubCategoriesQueryDto,
        @Res() res: Response,
      ): Promise<Response> {
        const data = await this.subcategoriesService.getAllSubCategorie(query);
        return res.status(200).json({ message:'success',data });
      }

      @Delete(':_id')
      @Auth([ UserType.ADMIN])
      async deleteSubCategories(
        @Param(new ZodValidationPipe(updateSubCategoriesParamsDto)) param: TupdateSubCategoriesParamsDto,
        @Res() res: Response,
      ): Promise<Response> {
         await this.subcategoriesService.deleteSubCategories(param._id);
        return res.status(200).json({ message:'deleted successfully' });
      }

}