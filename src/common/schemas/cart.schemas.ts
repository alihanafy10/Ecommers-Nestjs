
import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { calculateCartTotale } from "../utils";




@Schema({ timestamps: true })
export class Cart {
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
  products: {
    productId: mongoose.Schema.Types.ObjectId;
    quantity: number;
    price: number;
  }[];

  @Prop({
    type:Number,
  })
  subTotal: number;
}
const cartSchema = SchemaFactory.createForClass(Cart)


// // pre-save hook لحساب الإجمالي
cartSchema.pre('save', function (next) {
  this.subTotal = calculateCartTotale(this.products);
  next();
});

// // post-save hook لحذف الكارت لو المنتجات فاضية
cartSchema.post('save', async function (doc, next) {
  if (doc.products.length === 0) {
    await doc.model('Cart').deleteOne({ userId: doc.userId });
  }
  next();
});



export const CartModel=MongooseModule.forFeature([{name:Cart.name,schema:cartSchema}])