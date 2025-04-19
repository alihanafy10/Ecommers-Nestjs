import { z } from "zod";

import { objectIdRule } from "../../../common/shared";


export const getCouponParamsDto = z
  .object({
    
    _id:z.string().refine(objectIdRule, {
      message: 'Invalid ObjectId',
    })
  
  })
  .strict();


export const getAllCouponQueryDto = z
  .object({
    isEnable:z.enum(["true","false"]).optional()
  })
  .strict();
