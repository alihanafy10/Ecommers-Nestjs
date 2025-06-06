import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as bcrypt from 'bcrypt';

import { Gender, UserProviderType, UserType } from "../shared";
import { Image } from "./interface/user.interface";


@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 14,
  })
  userName: string;
  @Prop({
    type: String,
    required: true,
    trim: true,
    unique: true,
  })
  email: string;
  @Prop({
    type: String,
    required: true,
    minlength: 6,
  })
  password: string;
  @Prop({
    type: String,
    required: true,
    enum: Object.values(UserType),
    default: UserType.BUYER,
  })
  userType: string;
  @Prop({
    type: Number,
    required: true,
    min: 10,
    max: 100,
  })
  age: number;
  @Prop({
    type: String,
    required: true,
    enum: Object.values(Gender),
  })
  gender: string;
  @Prop({
    type: String,
    required: true,
  })
  phone: string;
  @Prop({
    type: Boolean,
    default: false,
  })
  isEmailVerified: boolean;
  @Prop({
    type: Boolean,
    default: false,
  })
  isMarkedAsDeleted: boolean;
  @Prop({
    type: String,
    enum: Object.values(UserProviderType),
    default: UserProviderType.SYSTEM,
  })
  provider: string;
  @Prop({
    type: Object,
    required: false,
  })
  image: Image;
  @Prop({
    type: String,
    default: ''
  })
  otp: string;
  @Prop({
    type: Date,
    default: null
  })
  endDateOtp: Date;
}
const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre('save', function(next)  {
  this.password = bcrypt.hashSync(this.password, +process.env.SALT);
  next()
})

export const UserModel=MongooseModule.forFeature([{name:User.name,schema:UserSchema}])