import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";


import { CloudinaryModule } from "../cloudinary/cloudinary.module";

import {   BrandModel, CategoriesModel, SubCategoriesModel, UserModel,ProductModel } from "../../common/schemas";
import { ApiFeatures, CheakExisit } from "../../services";
import { subCategoriesController } from "./subCategories.controller";
import { subCategoriesService } from "./subCategories.service";


@Module({
  imports: [CloudinaryModule,CategoriesModel,UserModel,SubCategoriesModel,BrandModel,ProductModel],
  controllers: [subCategoriesController],
  providers: [subCategoriesService,JwtService,CheakExisit,ApiFeatures],
})
export class SubCategoriesModule{}