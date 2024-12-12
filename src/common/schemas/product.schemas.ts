import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";


import { ProductBadges } from "../shared";


@Schema({ timestamps: true })
export class Product {
  @Prop({
    type:String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    lowercase: true,
    index: true,
  })
  slug: string;

  @Prop({
    type:String,
    required: false,
    trim: true,
    maxlength: 500,
  })
  overview: string;

  @Prop({
    type:String,
    required: true,
    trim: true,
    enum:Object.values(ProductBadges),
    default: ProductBadges.NEW,
  })
  badges:string;

  
 

  //ides 
  @Prop({
    type:mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  })
  createdBy: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories",
    required: true,
  })
  categoryId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategories",
    required: true,
  })
  subCategoryId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  })
  brandId: mongoose.Schema.Types.ObjectId;
}
const productSchema = SchemaFactory.createForClass(Product)

export const ProductModel=MongooseModule.forFeature([{name:Product.name,schema:productSchema}])