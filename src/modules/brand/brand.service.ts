import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import slugify from "slugify";
import { nanoid } from "nanoid";


import {  Brand, Product, SubCategories } from "../../common/schemas";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { ApiFeatures, CheakExisit } from "../../services";
import { TcreateBrandBodyDto, TgetAllBrandQueryDto, TgetBrandQueryDto, TupdateBrandBodyDto, TupdateBrandParamsDto } from "../../common/types";



@Injectable()

export class BrandService {
    
    constructor(
        @InjectModel(SubCategories.name) private subCategoriesModel: Model<SubCategories>,
        @InjectModel(Product.name) private productModel: Model<Product>,
        @InjectModel(Brand.name) private brandModel: Model<Brand>,
        @Inject() private readonly apiFeatures:ApiFeatures,
        private readonly cloudinaryService: CloudinaryService,
        private readonly cheakExisit:CheakExisit
      ) {}

       /**
       * create new categories
       * @param {TcreateBrandBodyDto}body - name categoryId ,subcategoryId
       * @param {Request}req 
       * @param {Express.Multer.File}file 
       * 
       * @throws {BadRequestException} -if Cannot find subcategories
       * @throws {BadRequestException} -if name already exists
       * @throws {BadRequestException} -if dosn't uploade image
       *
       * @returns {Brand} -data
       */
   async createBrand(body:TcreateBrandBodyDto,req:Request|any,file:Express.Multer.File|any): Promise<Brand> {
    //featch data from body
    const { name,categoryId,subCategoryId } = body;

    //cheak exisit subcategoryand categories
    const subcategories:any=await this.subCategoriesModel.findById({
        _id:subCategoryId,
        categoryId
    }).populate('categoryId')
    if(!subcategories)throw new BadRequestException(`Cannot find sub-categories`)

    //cheak exisit name
    await this.cheakExisit.cheakExisit(this.brandModel,name)

     //create slug
const slug = slugify(name, {
  replacement: "-",
  trim: true,
  lower: true,
});

//check image of brabd
if(!file)
  throw new BadRequestException('please upload an image')

//create customId
const customId = nanoid(5);

//upload image

const {public_id,secure_url}=await this.cloudinaryService.uploadFile(
  file,
  {
    folder: `${process.env.UPLOADE_FOLDER}/Categories/${subcategories.categoryId.customId}/SubCategories/${subcategories.customId}/Brand/${customId}`,
  }
)

//create brand obj
const brandObj = new this.brandModel({
  name,
  slug,
  image: {
    public_id,
    secure_url,
  },
  customId,
  createdBy: req.authUser._id,
  categoryId:categoryId,
  subCategoryId:subcategories._id
})

//save brand
const data=await brandObj.save()

return data
  }

  /**
       * 
       * @param {TupdateBrandBodyDto} body name
       * @param {TupdateBrandParamsDto} param _id
       * @param file 
       * 
       * @throws {BadRequestException} -brand not found
       * @throws {BadRequestException} -if name already exists
       * 
       * @returns {Brand} 
       */
  async updateBrand(body:TupdateBrandBodyDto,param:TupdateBrandParamsDto,file:Express.Multer.File|any): Promise<Brand>{
    //get the brand
    const brand: Brand|any=await this.brandModel.findById(param._id).populate([{
        path: 'categoryId',
    },
{
    path:"subCategoryId"
}])
    if(!brand)throw new BadRequestException('brand not found')
      
    //featch name 
    const{name}=body

    //update name
    if(name){
       //cheak exisit name
    await this.cheakExisit.cheakExisit(this.brandModel,name)

        //create slug
const slug = slugify(name, {
  replacement: "-",
  trim: true,
  lower: true,
});
//update data
brand.name=name
brand.slug=slug
    }

    //update image 
    if(file){
      //split puplicId
      const spletedPublicId = brand.image.public_id.split(`${brand.customId}/`)[1]

      const { secure_url } = await this.cloudinaryService.uploadFile(
        file,
        {
          folder: `${process.env.UPLOADE_FOLDER}/Categories/${brand.categoryId.customId}/SubCategories/${brand.subCategoryId.customId}/Brand/${brand.customId}`,
          public_id:spletedPublicId
        })
        //update secure_url
        brand.image.secure_url=secure_url
    }

    //save categories data
   await brand.save()

   return brand

  }


  
    /**
       * @param {TgetBrandQueryDto} query name,slug,_id
       * 
       * @throws {BadRequestException} -Brand not found
       * 
       * @returns {Brand}
       */
    async getBrand(query:TgetBrandQueryDto):Promise<Brand>{
      //featch data from query 
      const {_id,name,slug}=query 

      //create queryFilter
      const queryFilter:TgetBrandQueryDto = {};

      if(_id)queryFilter._id=_id
      if(name)queryFilter.name=name
      if (slug) queryFilter.slug = slug

      //get data
      const data=await this.brandModel.findOne(queryFilter)
      if(!data)throw new BadRequestException('Brand not found')

      return data
    }


     /**
           * @param {TgetAllBrandQueryDto} query
           * 
           * @returns {Brand[]}
           */
           async getAllBrand(query:TgetAllBrandQueryDto):Promise<Brand[]>{
            const subCategorie =await this.apiFeatures.filter_sort_pagination(
              this.brandModel,
               query,
               undefined,
              "product"
              )
    
            return subCategorie
          }


     /**
           * @param {TgetAllBrandQueryDto} query
           * 
           * @returns {Brand[]}
           */
           async getAllBrandSCN(filters:{name?:string,slug?:string,subCategoryId?:any,categoryId?:any}):Promise<Brand[]>{
           const query:any={}
           if(filters.name)query.name = filters.name
           if(filters.slug)query.slug = filters.slug
           if(filters.categoryId)query.categoryId=filters.categoryId
           if(filters.subCategoryId)query.subCategoryId=filters.subCategoryId

           const brands=await this.brandModel.find(query).populate([{path:"subCategoryId"},{path:"categoryId"}])
           return brands
          }


          /**
       * 
       * @param {string}_id 
       */
      async deleteBrand(_id:string):Promise<void>{
        //delete categories
        const data:Brand|any=await this.brandModel.findByIdAndDelete(_id).populate([{path:"subCategoryId"},{path:"categoryId"}]);
        if(!data)throw new BadRequestException('brand not found')

          //delete image from cloudinary
          const path=`${process.env.UPLOADE_FOLDER}/Categories/${data.categoryId.customId}/SubCategories/${data.subCategoryId.customId}/Brand/${data.customId}`
          await this.cloudinaryService.deleteResourcesByPrefix(path)
          await this.cloudinaryService.deleteFolder(path)


          // delete relatev product from db
          await this.productModel.deleteMany({brandId:data._id})

//todo delete relatev wachlist from db
      }
 
}