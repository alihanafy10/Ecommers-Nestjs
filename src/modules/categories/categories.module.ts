import { Module } from "@nestjs/common";


import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { CategoriesModel, UserModel } from "../../common/schemas";
import { JwtService } from "@nestjs/jwt";


@Module({
  imports: [CloudinaryModule,CategoriesModel,UserModel],
  controllers: [CategoriesController],
  providers: [CategoriesService,JwtService],
})
export class CategoriesModule {}