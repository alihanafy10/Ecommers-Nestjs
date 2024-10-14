import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";


const RequiredStringProp = {
    type: String,
    required: true,
};

const RequiredNumberProp = {
    type: Number,
    required: true,
}

const BooleanDefaultProp={
        type: Boolean,
        default:false,
    }

@Schema({ timestamps: true })
export class Address{
    @Prop({
        type: Types.ObjectId,
        required: true,
        ref:'User'
    })
    userId: Types.ObjectId;
    @Prop(RequiredStringProp)
    country: string;
    @Prop(RequiredStringProp)
    city: string;
    @Prop(RequiredNumberProp)
    postalCode: number;
    @Prop(RequiredNumberProp)
    builidingNumber: number;
    @Prop(RequiredNumberProp)
    flooreNumber: number;
    @Prop({
        type: String,
        required:false
    })
    addressLable: string;
    @Prop(BooleanDefaultProp)
    isDefualt: boolean;
    @Prop(BooleanDefaultProp)
    isMarkedAsDeleted: boolean;
}

const AddressSchema = SchemaFactory.createForClass(Address)

export const AddressModel=MongooseModule.forFeature([{name:Address.name,schema:AddressSchema}])
