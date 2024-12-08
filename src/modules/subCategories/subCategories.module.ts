import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";


import { CloudinaryModule } from "../cloudinary/cloudinary.module";

import {   CategoriesModel, SubCategoriesModel, UserModel } from "../../common/schemas";
import { CheakExisit } from "../../services";
import { subCategoriesController } from "./subCategories.controller";
import { subCategoriesService } from "./subCategories.service";


@Module({
  imports: [CloudinaryModule,CategoriesModel,UserModel,SubCategoriesModel],
  controllers: [subCategoriesController],
  providers: [subCategoriesService,JwtService,CheakExisit],
})
export class SubCategoriesModule{}