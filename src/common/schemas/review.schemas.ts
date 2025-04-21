import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { ReviewStatus } from "../shared";



@Schema({ timestamps: true })
export class Review {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Schema.Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  productId: mongoose.Schema.Types.ObjectId;
  @Prop({
    type: Number,
    required: true,
    min: 1,
    max: 5,
  })
  reviewRating: number;
  rewiewBody: string;
  @Prop({
    type: String,
    enum: Object.values(ReviewStatus),
    default: ReviewStatus.PENDING,
  })
  reviewStatus: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    //   required: true,
  })
  actionDoneBy: mongoose.Schema.Types.ObjectId;
}
const reviewSchema = SchemaFactory.createForClass(Review)



export const ReviewModel=MongooseModule.forFeature([{name:Review.name,schema:reviewSchema}])