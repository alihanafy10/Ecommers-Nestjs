import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor,FileInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";

import { ProductService } from "./product.service";
import { Auth } from "../../common/decorator";
import { UserType } from "../../common/shared";
import { ZodValidationPipe } from "../../common/pipes";
import { createFileUploadPipe } from "../../common/utils";
import { createProductBodyDto, getAllProductQueryDto, updateProductBodyDto, updateProductparamDto } from "./dto";
import { TcreateProductBodyDto, TgetAllProductQueryDto, TupdateProductBodyDto, TupdateProductparamDto } from "../../common/types";

@Controller('product')
export class ProductController{
    constructor(private readonly productService:ProductService) {}

    @Post('create')
    @UseInterceptors(FilesInterceptor('images'))
    @Auth([ UserType.ADMIN])
    async createProduct(
        @Req() req: Request,
        @Res() res: Response,
        @Body(new ZodValidationPipe(createProductBodyDto)) body:TcreateProductBodyDto ,
        @UploadedFiles() files: Express.Multer.File,
      ): Promise<Response> {
      //If the file exists from it via => createFileUploadPipe
      if (files) {
        await createFileUploadPipe().transform(files);
      }
      if (typeof body.specs === 'string') {
        body.specs = JSON.parse(body.specs);
    }

        const data = await this.productService.createProduct(body, req, files);
        return res.status(201).json({ message: 'created successfully', data });
      }

      @Put(':_id')
      @UseInterceptors(FileInterceptor('image'))
      @Auth([ UserType.ADMIN])
      async updateProduct(
        @Req() req: Request,
        @Res() res: Response,
        @Body(new ZodValidationPipe(updateProductBodyDto)) body: TupdateProductBodyDto,
        @Param(new ZodValidationPipe(updateProductparamDto)) param: TupdateProductparamDto,
        @UploadedFile() file?: Express.Multer.File,
      ) {
         //If the file exists from it via => createFileUploadPipe
    if (file) {
      await createFileUploadPipe().transform(file);
    }

    const data=await this.productService.updateProduct(param._id,body,file)
    return res.status(201).json({ message: 'updated successfully', data });
      }

      @Get(":_id")
      @Auth([ UserType.ADMIN , UserType.BUYER])
      async getProduct(
        @Param(new ZodValidationPipe(updateProductparamDto)) param:TupdateProductparamDto,
        @Res() res: Response,
      ): Promise<Response> {
        const data = await this.productService.getProduct(param._id);
        return res.status(200).json({ message:'success',data });
      }


      @Get()
      @Auth([ UserType.ADMIN , UserType.BUYER])
      async getAllProduct(
        @Query(new ZodValidationPipe(getAllProductQueryDto)) query:TgetAllProductQueryDto,
        @Res() res: Response,
      ): Promise<Response> {
        const data = await this.productService.getAllProduct(query);
        return res.status(200).json({ message:'success',data });
      }

      @Delete(':_id')
      @Auth([ UserType.ADMIN])
      async deleteProduct(
        @Param(new ZodValidationPipe(updateProductparamDto)) param: TupdateProductparamDto,
        @Res() res: Response,
      ): Promise<Response> {
         await this.productService.deleteProduct(param._id);
        return res.status(200).json({ message:'deleted successfully' });
      }

}