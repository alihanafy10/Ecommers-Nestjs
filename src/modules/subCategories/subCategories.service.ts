import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import slugify from "slugify";
import { nanoid } from "nanoid";
import { Request } from "express";

import {  Brand, Categories, Product, SubCategories } from "../../common/schemas";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import {  TcreateSubCategoriesBodyDto, TgetAllSubCategoriesQueryDto, TgetSubCategorieQueryDto, TupdateSubCategoriesBodyDto, TupdateSubCategoriesParamsDto } from "../../common/types";
import { ApiFeatures, CheakExisit } from "../../services";


@Injectable()

export class subCategoriesService {
    
    constructor(
        @InjectModel(SubCategories.name) private subCategoriesModel: Model<SubCategories>,
        @InjectModel(Categories.name) private categoriesModel: Model<Categories>,
        @InjectModel(Brand.name) private brandModel: Model<Brand>,
        @InjectModel(Product.name) private productModel: Model<Product>,
        @Inject() private readonly apiFeatures:ApiFeatures,
        private readonly cloudinaryService: CloudinaryService,
        private readonly cheakExisit:CheakExisit
      ) {}

   /**
       * create new categories
       * @param {TcreateSubCategoriesBodyDto}body - name categoryId
       * @param {Request}req 
       * @param {Express.Multer.File}file 
       * 
       * @throws {BadRequestException} -if Cannot find category
       * @throws {BadRequestException} -if name already exists
       * @throws {BadRequestException} -if dosn't uploade image
       *
       * @returns {SubCategories} -data
       */
   async createSubCategories(body:TcreateSubCategoriesBodyDto,req:Request|any,file:Express.Multer.File|any): Promise<SubCategories> {
    //featch name and categoryId 
    const { name,categoryId } = body;

    //cheak exisit category
    const categories:Categories|any=await this.categoriesModel.findById(categoryId)
    if(!categories)throw new BadRequestException(`Cannot find category`)

    //cheak exisit name
    await this.cheakExisit.cheakExisit(this.subCategoriesModel,name)

     //create slug
const slug = slugify(name, {
  replacement: "-",
  trim: true,
  lower: true,
});

//check image of subcategories
if(!file)
  throw new BadRequestException('please upload an image')

//create customId
const customId = nanoid(5);

//upload image

const {public_id,secure_url}=await this.cloudinaryService.uploadFile(
  file,
  {
    folder: `${process.env.UPLOADE_FOLDER}/Categories/${categories.customId}/SubCategories/${customId}`,
  }
)

//create subcategories obj
const subcategoriesObj = new this.subCategoriesModel({
  name,
  slug,
  image: {
    public_id,
    secure_url,
  },
  customId,
  createdBy: req.authUser._id,
  categoryId:categories._id
})

//save categories
const data=await subcategoriesObj.save()

return data
  }
      
  /**
       * 
       * @param {TupdateSubCategoriesBodyDto} body name
       * @param {TupdateSubCategoriesParamsDto} param _id
       * @param file 
       * 
       * @throws {BadRequestException} -subCategories not found
       * @throws {BadRequestException} -if name already exists
       * 
       * @returns {SubCategories} 
       */
  async updateSubCategories(body:TupdateSubCategoriesBodyDto,param:TupdateSubCategoriesParamsDto,file:Express.Multer.File|any): Promise<SubCategories>{
    //get the subcategories
    const subCategories: SubCategories|any=await this.subCategoriesModel.findById(param._id).populate("categoryId")
    if(!subCategories)throw new BadRequestException('subCategories not found')
      
    //featch name 
    const{name}=body

    //update name
    if(name){
       //cheak exisit name
    await this.cheakExisit.cheakExisit(this.subCategoriesModel,name)

        //create slug
const slug = slugify(name, {
  replacement: "-",
  trim: true,
  lower: true,
});
//update data
subCategories.name=name
subCategories.slug=slug
    }

    //update image 
    if(file){
      //split puplicId
      const spletedPublicId = subCategories.image.public_id.split(`${subCategories.customId}/`)[1]

      const { secure_url } = await this.cloudinaryService.uploadFile(
        file,
        {
          folder: `${process.env.UPLOADE_FOLDER}/Categories/${subCategories.categoryId.customId}/SubCategories/${subCategories.customId}`,
          public_id:spletedPublicId
        })
        //update secure_url
        subCategories.image.secure_url=secure_url
    }

    //save categories data
   await subCategories.save()

   return subCategories

  }


    /**
       * @param {TgetSubCategorieQueryDto} query name,slug,_id
       * 
       * @throws {BadRequestException} -SubCategories not found
       * 
       * @returns {SubCategories}
       */
    async getSubCategorie(query:TgetSubCategorieQueryDto):Promise<SubCategories>{
        //featch data from query 
        const {_id,name,slug}=query 

        //create queryFilter
        const queryFilter:TgetSubCategorieQueryDto = {};

        if(_id)queryFilter._id=_id
        if(name)queryFilter.name=name
        if (slug) queryFilter.slug = slug

        //get data
        const data=await this.subCategoriesModel.findOne(queryFilter)
        if(!data)throw new BadRequestException('subCategories not found')

        return data
      }

       /**
       * @param {TgetAllSubCategoriesQueryDto} query
       * 
       * @returns {SubCategories[]}
       */
       async getAllSubCategorie(query:TgetAllSubCategoriesQueryDto):Promise<SubCategories[]>{
        const subCategorie =await this.apiFeatures.filter_sort_pagination(
          this.subCategoriesModel,
           query,
           undefined,
          "brand"
          )

        return subCategorie
      }

      /**
       * 
       * @param {string}_id 
       */
      async deleteSubCategories(_id:string):Promise<void>{
        //delete categories
        const data:SubCategories|any=await this.subCategoriesModel.findByIdAndDelete(_id).populate("categoryId");
        if(!data)throw new BadRequestException('sub-categorie not found')

          //delete image from cloudinary
          const path=`${process.env.UPLOADE_FOLDER}/Categories/${data.categoryId.customId}/SubCategories/${data.customId}`
          await this.cloudinaryService.deleteResourcesByPrefix(path)
          await this.cloudinaryService.deleteFolder(path)


          //todo delete relatev Brand from db
          await this.brandModel.deleteMany({subCategoryId:data._id})
          
          //todo delete relatev product from db
          await this.productModel.deleteMany({subCategoryId:data._id})
          
          //todo delete relatev wachlist from db
      }
}