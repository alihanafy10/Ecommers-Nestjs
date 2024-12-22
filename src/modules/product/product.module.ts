import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";


import { CloudinaryModule } from "../cloudinary/cloudinary.module";

import {   BrandModel, CategoriesModel, ProductModel, SubCategoriesModel, UserModel } from "../../common/schemas";
import { ApiFeatures, CheakExisit } from "../../services";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";




@Module({
  imports: [CloudinaryModule,CategoriesModel,UserModel,SubCategoriesModel,BrandModel,ProductModel],
  controllers: [ProductController],
  providers: [ProductService,JwtService,CheakExisit,ApiFeatures],
})
export class ProductModule{}