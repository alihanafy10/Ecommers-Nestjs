import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";


import { CloudinaryModule } from "../cloudinary/cloudinary.module";

import {   BrandModel, CategoriesModel, SubCategoriesModel, UserModel } from "../../common/schemas";
import { CheakExisit } from "../../services";
import { BrandController } from "./brand.controller";
import { BrandService } from "./brand.service";



@Module({
  imports: [CloudinaryModule,CategoriesModel,UserModel,SubCategoriesModel,BrandModel],
  controllers: [BrandController],
  providers: [BrandService,JwtService,CheakExisit],
})
export class BrandModule{}