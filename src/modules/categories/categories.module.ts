import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";


import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import {   BrandModel, CategoriesModel, ProductModel, SubCategoriesModel, UserModel } from "../../common/schemas";
import { ApiFeatures, CheakExisit } from "../../services";


@Module({
  imports: [CloudinaryModule,CategoriesModel,UserModel,SubCategoriesModel,BrandModel,ProductModel],
  controllers: [CategoriesController],
  providers: [CategoriesService,JwtService,CheakExisit,ApiFeatures],
})
export class CategoriesModule{}