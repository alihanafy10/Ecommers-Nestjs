import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import * as paginate from "mongoose-paginate-v2";

import { Image } from "./interface/user.interface";


@Schema({ timestamps: true,toJSON:{virtuals:true},toObject:{virtuals:true},id:false  })
export class Brand {
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
    type:mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  })
  createdBy: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: Object,
    required: true,
  })
  image: Image;

  //ides 
  @Prop({
    type: String,
    required: true,
  })
  customId:string

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
}
const brandSchema = SchemaFactory.createForClass(Brand)

//add plugen to do pagination
brandSchema.plugin(paginate)

//add virtual populate
brandSchema.virtual('product',{
  ref: 'Product',
  localField: '_id',
  foreignField: 'brandId',
})

export const BrandModel=MongooseModule.forFeature([{name:Brand.name,schema:brandSchema}])