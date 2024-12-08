import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Image } from "./interface/user.interface";
import mongoose from "mongoose";


@Schema({ timestamps: true })
export class SubCategories {
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
}
const subCategoriesSchema = SchemaFactory.createForClass(SubCategories)

export const SubCategoriesModel=MongooseModule.forFeature([{name:SubCategories.name,schema:subCategoriesSchema}])