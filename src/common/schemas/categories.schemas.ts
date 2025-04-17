import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import * as paginate from "mongoose-paginate-v2";

import { Image } from "./interface/user.interface";


@Schema({ timestamps: true,toJSON:{virtuals:true},toObject:{virtuals:true},id:false })
export class Categories {
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

  @Prop({
    type: String,
    required: true,
  })
  customId:string
}
const CategoriesSchema = SchemaFactory.createForClass(Categories)

//add plugen to do pagination
CategoriesSchema.plugin(paginate)

//add virtual populate
CategoriesSchema.virtual('subCtegories',{
  ref: 'SubCategories',
  localField: '_id',
  foreignField: 'categoryId',
})

//model
export const CategoriesModel=MongooseModule.forFeature([{name:Categories.name,schema:CategoriesSchema}])