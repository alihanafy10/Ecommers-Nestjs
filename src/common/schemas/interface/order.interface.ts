import mongoose from "mongoose";

export interface Products{
    productId: mongoose.Schema.Types.ObjectId;
       quantity: number;
       price: number;
}