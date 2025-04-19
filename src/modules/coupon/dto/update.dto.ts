import { z } from "zod";

import { CouponType, objectIdRule } from "../../../common/shared";

export const patchCouponParamsDto = z
  .object({
    
    _id:z.string().refine(objectIdRule, {
      message: 'Invalid ObjectId',
    })
  
  })
  .strict();


export const patchCouponBodyDto = z
  .object({
    isEnable:z.boolean()
  })
  .strict();

  


export const updateCouponBodyDto = z
  .object({
    name:z.string().min(1).max(15),
    couponType:z.nativeEnum(CouponType),
    couponAmount:z.number().int().positive("maxCount must be a positive integer"),
    from:z.string().date(),
    to:z.string().date(),
    users:z.array(
        z.object({
            userId:z.string().refine(objectIdRule, {
                message: 'Invalid ObjectId',
              }),
              maxCount:z.number().int().positive("maxCount must be a positive integer")
        })
    )

  })
  .partial()
  .strict();