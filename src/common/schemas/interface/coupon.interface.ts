import mongoose from "mongoose";


export interface UsersCoupon{
   userId:mongoose.Schema.Types.ObjectId;
       maxCount:number,
       useageCount:number
}