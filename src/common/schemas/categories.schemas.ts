import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Image } from "./interface/user.interface";
import mongoose from "mongoose";


@Schema({ timestamps: true })
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

export const CategoriesModel=MongooseModule.forFeature([{name:Categories.name,schema:CategoriesSchema}])