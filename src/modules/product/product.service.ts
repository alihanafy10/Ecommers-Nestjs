import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { query, Request } from 'express';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { nanoid } from 'nanoid';
import slugify from 'slugify';

import { TcreateProductBodyDto, TgetAllProductQueryDto, TupdateProductBodyDto } from '../../common/types';
import { Brand, Product } from '../../common/schemas';
import { AppliedDiscount, Image } from '../../common/schemas/interface';
import { ApiFeatures, CheakExisit } from '../../services';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { calculateAPPliesPrice } from '../../common/utils';


@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Brand.name) private brandModel: Model<Brand>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @Inject() private readonly apiFeatures:ApiFeatures,
    private readonly cloudinaryService: CloudinaryService,
    private readonly cheakExisit: CheakExisit,
  ) {}
  /**
   * 
   *@param {TcreateProductBodyDto}body 
   * @param {Request}req 
   * @param {Express.Multer.File}files 
   * 
   * @throws {BadRequestException} -if Cannot find brand
    * @throws {BadRequestException} -if name already exists
    * @throws {BadRequestException} -if dosn't uploade images
   * 
   * @returns {Product} -data
   */
  async createProduct(
    body: TcreateProductBodyDto,
    req: Request|any,
    files: Express.Multer.File | any,
  ):Promise<Product> {
    // console.log(body);
    // console.log(files);

    //featch data from body
    const {
      amount,
      name,
      price,
      stock,
      overview,
      type,
      specs,
      brandId,
      categoryId,
      subCategoryId,
    } = body;

    //cheak exisit name
    await this.cheakExisit.cheakExisit(this.brandModel,name)

    //cheack files
    if (!files?.length) throw new BadRequestException('please uploade images');

    //cheack ides
    const brand:any|Brand = await this.brandModel
      .findOne({ _id: brandId, categoryId, subCategoryId })
      .populate([{ path: 'categoryId' }, { path: 'subCategoryId' }]);
    if (!brand) throw new BadRequestException('brand not found');

    //create slug
    const slug = slugify(name, {
      replacement: "-",
      trim: true,
      lower: true,
    });

    //images
    let urls=[]
    const customId=nanoid(5);
    const brandCustomId=brand.customId
    const subCategoriesCustomId=brand.subCategoryId.customId
    const categoriesCustomId=brand.categoryId.customId
    const path=`${process.env.UPLOADE_FOLDER}/Categories/${categoriesCustomId}/SubCategories/${subCategoriesCustomId}/Brand/${brandCustomId}/Product/${customId}`
    for(const file of files){
        //uploade image
        const {public_id,secure_url}=await this.cloudinaryService.uploadFile(
            file,
            {
              folder: path
            }
          )
          urls.push({secure_url,public_id})
    }

    //new productObj
    const productObj=new this.productModel({
        name,
        slug,
        overview,
        specs,
        price,
        appliedDiscount: {
            amount,
            type,
          },
        stock,
        images:{
            urls,
            customId
        },
        createdBy:req.authUser._id,
        categoryId:brand.categoryId._id,
        subCategoryId:brand.subCategoryId._id,
        brandId:brand._id
    })
    //savedata
    const data=await productObj.save()
    return data
  }

  /**
   * @param {TupdateProductBodyDto}body 
   * @param {string}_id 
   * @param {Express.Multer.File}file
   * 
   * @throws {BadRequestException} -if Cannot find product
    * @throws {BadRequestException} -if name already exists
    * @throws {BadRequestException} -please uploade iamge and public_id
    * 
    * @returns {Product}-data
   */
  async updateProduct(_id:string,body:TupdateProductBodyDto|any,file?:Express.Multer.File|any):Promise<Product>{

//featch data
const {
  amount,
  name,
  price,
  stock,
  overview,
  type,
  specs,
  public_id,
  badges
} = body;

//cheack product found
const product:Product|any=await this.productModel.findById(_id).populate([{path:"subCategoryId"},{path:"categoryId"},{path:"brandId"}])
if(!product)throw new BadRequestException("product not found")

  if(name){
     //cheak exisit name
     await this.cheakExisit.cheakExisit(this.productModel,name)

      //create slug
    const slug = slugify(name, {
      replacement: "-",
      trim: true,
      lower: true,
    });

    product.name=name
    product.slug=slug
  }
  if(stock)product.stock=stock
  if(overview)product.overview=overview
  if(badges)product.badges=badges
  if(specs)product.specs=specs
  if(price||type||amount){
    const newPrice= price|| product.price
    const discount:AppliedDiscount={
    amount:amount||product.appliedDiscount.amount,
    type:type||product.appliedDiscount.type
    }

    product.appliedPrice=calculateAPPliesPrice(newPrice,discount)
    product.price=newPrice
    product.appliedDiscount=discount
  }
//update one image
  if(file&&public_id){
//split puplicId
const spletedPublicId = public_id.split(`${product.images.customId}/`)[1]

const { secure_url } = await this.cloudinaryService.uploadFile(
  file,
  {
    folder: `${process.env.UPLOADE_FOLDER}/Categories/${product.categoryId.customId}/SubCategories/${product.subCategoryId.customId}/Brand/${product.brandId.customId}/Product/${product.images.customId}`,
    public_id:spletedPublicId
  })
  //update secure_url
  
  product.images.urls.map((ele: Image)=>{
    if(ele.public_id==public_id){
      ele.secure_url=secure_url
    }
    return ele
  })
  }
  else if(file || public_id){
    throw new BadRequestException("please uploade iamge and public_id")
  }

  //save product
  const data=await product.save()
  return data
  
  }

  /**
   *  @param {string}_id 
   * 
   * @returns {Product}-data
   */
  async getProduct(_id:string):Promise<Product>{
    const product:Product|any=await this.productModel.findById(_id).populate([{path:"subCategoryId"},{path:"categoryId"},{path:"brandId"}])
     return product
  }

  /**
   * 
   * @param {TgetAllProductQueryDto}query 
   * 
   * @returns {Product[]} -product
   */
  async getAllProduct(query:TgetAllProductQueryDto):Promise<Product[]>{
    console.log(query);
    
    const product =await this.apiFeatures.filter_sort_pagination(
      this.productModel,
       query,
       undefined,
      [{path:"brandId"},{path:"subCategoryId"},{path:"categoryId"},]
      )

    return product
  
  }


  async deleteProduct(_id:string):Promise<void>{
    //delete categories
    const data:Product|any=await this.productModel.findByIdAndDelete(_id).populate([{path:"subCategoryId"},{path:"categoryId"},{path:"brandId"}]);
    if(!data)throw new BadRequestException('product not found')

      //delete image from cloudinary
      const path=`${process.env.UPLOADE_FOLDER}/Categories/${data.categoryId.customId}/SubCategories/${data.subCategoryId.customId}/Brand/${data.brandId.customId}/Product/${data.images.customId}`
      await this.cloudinaryService.deleteResourcesByPrefix(path)
      await this.cloudinaryService.deleteFolder(path)


//todo delete relatev wachlist from db
  }
}

