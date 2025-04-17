import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";


import { CloudinaryModule } from "../cloudinary/cloudinary.module";

import {   BrandModel, CategoriesModel, ProductModel, SubCategoriesModel, UserModel } from "../../common/schemas";
import { ApiFeatures, CheakExisit } from "../../services";
import { BrandController } from "./brand.controller";
import { BrandService } from "./brand.service";



@Module({
  imports: [CloudinaryModule,CategoriesModel,UserModel,SubCategoriesModel,BrandModel,ProductModel],
  controllers: [BrandController],
  providers: [BrandService,JwtService,CheakExisit,ApiFeatures],
})
export class BrandModule{}