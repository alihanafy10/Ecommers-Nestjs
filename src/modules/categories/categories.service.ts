import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Request } from "express";

import { Categories } from "../../common/schemas";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { TcreateCategoriesBodyDto } from "../../common/types";

@Injectable()

export class CategoriesService {
    
    constructor(
        @InjectModel(Categories.name) private userModel: Model<Categories>,
        private readonly cloudinaryService: CloudinaryService,
      ) {}

      async createCategories(body:TcreateCategoriesBodyDto,req:Request,file:Express.Multer.File){
        
      }
}