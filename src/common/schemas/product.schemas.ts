import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import * as paginate from "mongoose-paginate-v2";


import { DiscountType, ProductBadges } from "../shared";
import { AppliedDiscount, ProductImages } from "./interface";
import { calculateAPPliesPrice } from "../utils";



@Schema({ timestamps: true ,toJSON: { virtuals: true },toObject:{ virtuals: true }})
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
    required: true,
    trim: true,
    maxlength: 500,
  })
  overview: string;

  @Prop({
    type:String,
    trim: true,
    enum:Object.values(ProductBadges),
    default: ProductBadges.NEW,
  })
  badges:string;

  @Prop({
     type: Object,
      required: true 
    }) 
  specs: Record<string, string|number>;

  @Prop({
    type: Number,
    required: true,
  })
  price: number;

  @Prop({
    type:Object,
    required: true,
    default:{
        amount: 0,
        type: DiscountType.PERCENT 
      },
  })
  appliedDiscount:AppliedDiscount; 

  @Prop({
    type: Number,
    required: true,
    default:function(){return calculateAPPliesPrice(this.price, this.appliedDiscount);}
  })
  appliedPrice:number;

  @Prop({
    type: Number,
    required: true,
    min:1
  })
  stock:number;

  @Prop({
    type:Number,
    min:0,
    max:5,
    default: 0,
  })
  rating: number;

  @Prop({
    type:Object,
    required: true,
  })
  images:ProductImages

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

//add plugen to do pagination
productSchema.plugin(paginate)

//virtual populate
productSchema.virtual("review", {
  ref: "Review", // The model to use
  localField: "_id", // Find people where `localField`
  foreignField: "productId", // is equal to `foreignField`
});

export const ProductModel=MongooseModule.forFeature([{name:Product.name,schema:productSchema}])