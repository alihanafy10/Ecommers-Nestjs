import { Body, Controller, Post, Req, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";

import { CategoriesService } from "./categories.service";
import { Auth } from "../../common/decorator";
import { UserType } from "../../common/shared";
import { ZodValidationPipe } from "../../common/pipes";
import { createCategoriesBodyDto } from "./dto";
import { TcreateCategoriesBodyDto } from "../../common/types";

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
        const data = await this.categoriesService.createCategories(body, req, file);
        return res.status(201).json({ message: 'created successfully', data });
      }
}