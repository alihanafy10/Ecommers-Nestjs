import { z } from 'zod';

import { Gender, UserType } from '../../../common/shared';

export const signUpBodyDto = z
  .object({
    userName: z.string().min(3).max(14),
    email: z.string().email(),
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
    confirmPassword: z.string(),
    age: z.preprocess(
      (val) => +val,
      z.number().int().positive().max(100).min(10),
    ),
    gender: z.nativeEnum(Gender),
    phone: z
      .string()
      .regex(
        /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/gm,
        { message: 'phone number not valid' },
      ),
    userType: z.nativeEnum(UserType),
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
