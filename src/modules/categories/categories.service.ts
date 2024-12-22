import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, PaginateModel } from "mongoose";
import slugify from "slugify";
import { nanoid } from "nanoid";
import { Request } from "express";

import { Brand, Categories, SubCategories,Product } from "../../common/schemas";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { TcreateCategoriesBodyDto, TgetAllCategorieQueryDto, TgetCategorieQueryDto, TupdateCategoriesBodyDto, TupdateCategoriesParamsDto } from "../../common/types";
import { ApiFeatures, CheakExisit } from "../../services";


@Injectable()

export class CategoriesService {
    
    constructor(
        @InjectModel(Categories.name) private categoriesModel: PaginateModel<Categories>,
        @InjectModel(SubCategories.name) private subCategoriesModel: Model<SubCategories>,
        @InjectModel(Brand.name) private brandModel: Model<Brand>,
        @InjectModel(Product.name) private productModel: Model<Product>,
        @Inject() private readonly apiFeatures:ApiFeatures,
        private readonly cloudinaryService: CloudinaryService,
        private readonly cheakExisit:CheakExisit
      ) {}

      /**
       * create new categories
       * @param {TcreateCategoriesBodyDto}body - name
       * @param {Request}req 
       * @param {Express.Multer.File}file 
       * 
       * @throws {BadRequestException} -if name already exists
       * @throws {BadRequestException} -if dosn't uploade image
       *
       * @returns {Categories} -data
       */
      async createCategories(body:TcreateCategoriesBodyDto,req:Request|any,file:Express.Multer.File|any): Promise<Categories> {
        //featch name 
        const { name } = body;

        //cheak exisit name
        await this.cheakExisit.cheakExisit(this.categoriesModel,name)

         //create slug
    const slug = slugify(name, {
      replacement: "-",
      trim: true,
      lower: true,
    });

    //check image of categories
    if(!file)
      throw new BadRequestException('please upload an image')

    //create customId
    const customId = nanoid(5);
    
    //upload image

    const {public_id,secure_url}=await this.cloudinaryService.uploadFile(
      file,
      {
        folder: `${process.env.UPLOADE_FOLDER}/Categories/${customId}`,
      }
    )

    //create categories obj
    const categoriesObj = new this.categoriesModel({
      name,
      slug,
      image: {
        public_id,
        secure_url,
      },
      customId,
      createdBy: req.authUser._id,
    })

    //save categories
const data=await categoriesObj.save()

return data
      }

      /**
       * 
       * @param {TupdateCategoriesBodyDto} body name
       * @param {TupdateCategoriesParamsDto} param _id
       * @param file 
       * 
       * @throws {BadRequestException} -categories not found
       * @throws {BadRequestException} -if name already exists
       * 
       * @returns {Categories} 
       */
      async updateCategories(body:TupdateCategoriesBodyDto,param:TupdateCategoriesParamsDto,file:Express.Multer.File|any): Promise<Categories>{
        //get the categories
        const categories=await this.categoriesModel.findById(param._id)
        if(!categories)throw new BadRequestException('categories not found')
          
        //featch name 
        const{name}=body

        //update name
        if(name){
           //cheak exisit name
        await this.cheakExisit.cheakExisit(this.categoriesModel,name)

            //create slug
    const slug = slugify(name, {
      replacement: "-",
      trim: true,
      lower: true,
    });
    //update data
    categories.name=name
    categories.slug=slug
        }

        //update image 
        if(file){
          //split puplicId
          const spletedPublicId = categories.image.public_id.split(`${categories.customId}/`)[1]

          const { secure_url } = await this.cloudinaryService.uploadFile(
            file,
            {
              folder: `${process.env.UPLOADE_FOLDER}/Categories/${categories.customId}`,
              public_id:spletedPublicId
            })
            //update secure_url
            categories.image.secure_url=secure_url
        }

        //save categories data
       await categories.save()

       return categories

      }

      /**
       * @param {TgetCategorieQueryDto} query name,slug,_id
       * 
       * @throws {BadRequestException} -categorie not found
       * 
       * @returns {Categories}
       */
      async getCategorie(query:TgetCategorieQueryDto):Promise<Categories>{
        //featch data from query 
        const {_id,name,slug}=query 

        //create queryFilter
        const queryFilter:TgetCategorieQueryDto = {};

        if(_id)queryFilter._id=_id
        if(name)queryFilter.name=name
        if (slug) queryFilter.slug = slug

        //get data
        const data=await this.categoriesModel.findOne(queryFilter)
        if(!data)throw new BadRequestException('categorie not found')

        return data
      }


      /**
       * @param {TgetAllCategorieQueryDto} query
       * 
       * @returns {Categories[]}
       */
      async getAllCategorie(query:TgetAllCategorieQueryDto):Promise<Categories[]>{
        const categorie =await this.apiFeatures.filter_sort_pagination(
          this.categoriesModel,
           query,
           undefined,
          "subCtegories"
          )

        return categorie
      }


      /**
       * 
       * @param {string}_id 
       */
      async deleteCategories(_id:string):Promise<void>{
        //delete categories
        const data:Categories|any=await this.categoriesModel.findByIdAndDelete(_id);
        if(!data)throw new BadRequestException('categorie not found')

          //delete image from cloudinary
          const path=`${process.env.UPLOADE_FOLDER}/Categories/${data.customId}`
          await this.cloudinaryService.deleteResourcesByPrefix(path)
          await this.cloudinaryService.deleteFolder(path)

          //delete relatev subCategories from db
          await this.subCategoriesModel.deleteMany({categoryId:data._id})
          
          //todo delete relatev Brand from db
          await this.brandModel.deleteMany({categoryId:data._id})

          //todo delete relatev product from db
          await this.productModel.deleteMany({categoryId:data._id})
          
          //todo delete relatev wachlist from db
          
      }
      
}