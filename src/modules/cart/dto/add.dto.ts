import { z } from "zod";

import { objectIdRule } from "../../../common/shared";


export const addToCartBodyDto = z
  .object({
    
    productId:z.string().refine(objectIdRule, {
      message: 'Invalid ObjectId',
    }),
    quantity:z.number().min(1)
  })
  .strict();