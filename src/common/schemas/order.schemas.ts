
import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Products } from "./interface";
import { OrderStatusType, PaymentMethodType } from "../shared";




@Schema({ timestamps: true })
export class Order {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop([
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ])
  products: Products[];

  @Prop({
    type:Boolean,
    default:true
  })
  fromCart:boolean;

  @Prop({
    type:String
  })
  address:string;

  @Prop({
    type:mongoose.Schema.Types.ObjectId,
    ref:'Address'
  })
  addressId:mongoose.Schema.Types.ObjectId;
  @Prop({
    type: String,
      required: true,
  })
  contactNumber:string;

  @Prop({
    type: Number,
    required: true,
  })
  subTotal:number;

  @Prop({
    type: Number,
    required: true,
  })
  shippingFee:number;
  @Prop({
    type: Number,
    required: true,
  })
  VAT:number;
  @Prop({
     type:mongoose.Schema.Types.ObjectId,
    ref:'Coupon'
  })
  couponId:mongoose.Schema.Types.ObjectId;
  @Prop({
    type: Number,
    required: true,
  })
  total:number;
  @Prop({
    type: Date,
    required: true,
  })
  estimatedDeliveryDate:Date;
  @Prop({
    type: String,
    required: true,
    enum: Object.values(PaymentMethodType),
  })
  paymentMethod:string;
@Prop({
    type: String,
      required: true,
      enum: Object.values(OrderStatusType),
})
orderStatus:string;
@Prop({
    type:mongoose.Schema.Types.ObjectId,
      ref: "User",
})
deliveredBy:mongoose.Schema.Types.ObjectId;
@Prop({
    type:mongoose.Schema.Types.ObjectId,
    ref: "User",
})
cancelledBy:mongoose.Schema.Types.ObjectId

    deliveredAt: Date;
    cancelledAt: Date;
    paymentIntent:string;
}
const orderSchema = SchemaFactory.createForClass(Order)



 


export const OrderModel=MongooseModule.forFeature([{name:Order.name,schema:orderSchema}])