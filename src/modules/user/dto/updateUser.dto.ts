import { z } from 'zod';

import {
  Gender,
  generalRules,
  objectIdRule,
  UserType,
} from '../../../common/shared';

//update user body
export const updateUserBodyDto = z
  .object({
    userName: z.string().min(3).max(14).optional(),
    email: z.string().email().optional(),
    age: generalRules.age.optional(),
    gender: z.nativeEnum(Gender).optional(),
    phone: generalRules.phone.optional(),
  })
  .strict();

export const updateUserTypeBodyDto = z
  .object({
    userType: z.nativeEnum(UserType),
  })
  .strict();

//update userType body
export const updateUserTypeParamsDto = z
  .object({
    userId: z.string().refine(objectIdRule, {
      message: 'Invalid ObjectId',
    }),
  })
  .strict();

//update password body

export const updatePasswordBodyDto = z
  .object({
    password: generalRules.password,
  })
  .strict();