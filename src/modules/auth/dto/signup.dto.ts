import { z } from 'zod';

import { Gender, generalRules } from '../../../common/shared';

export const signUpBodyDto = z
  .object({
    userName: z.string().min(3).max(14),
    email: z.string().email(),
    password: generalRules.password,
    confirmPassword: z.string(),
    age: generalRules.age,
    gender: z.nativeEnum(Gender),
    phone: generalRules.phone,

    country: z.string(),
    city: z.string(),
    postalCode: z.preprocess((val) => +val, z.number()),
    builidingNumber: z.preprocess((val) => +val, z.number().int()),
    flooreNumber: z.preprocess((val) => +val, z.number().int()),
    addressLable: z
      .string()
      .regex(/^[a-zA-Z1-9 ]{0,60}$/, { message: 'not valid addressLable' }),
  })
  .strict()
  .superRefine((data, ctx) => {
    // cheack if confirmePassword equal password
    if (data.confirmPassword !== data.password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The confirmPassword did not match password',
        path: ['confirmPassword'],
      });
    }
  });

export const twoStageSignupWithGoogleDto = z.object({
  _id:z.string(),
  age: z.number().int().positive().max(100).min(10),
  gender: z.nativeEnum(Gender),
  phone: generalRules.phone,
}).strict()
