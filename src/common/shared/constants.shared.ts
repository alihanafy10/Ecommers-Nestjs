
import { Types } from 'mongoose';
import { z } from 'zod';

export const extentions = {
  images: /(png|jpeg|jpg|gif|svg\+xml)/,
};

//general rules for zod validation
export const generalRules = {
  password: z
    .string()
    .min(6)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/,
      {
        message:
          'Minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character',
      },
    ),
  phone: z
    .string()
    .regex(
      /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/gm,
      { message: 'phone number not valid' },
    ),
  age: z.preprocess(
    (val) => +val,
    z.number().int().positive().max(100).min(10),
  ),
  IdesRole:z.string().refine(objectIdRule, {
    message: 'Invalid ObjectId',
  }),
};

//validate _id from monngose
 export function objectIdRule(value:any) {
  return Types.ObjectId.isValid(value)?true:false
}


