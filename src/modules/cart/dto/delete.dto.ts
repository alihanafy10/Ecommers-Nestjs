import { z } from "zod";

import { objectIdRule } from "../../../common/shared";


export const deleteFromCartParamsDto = z
  .object({
    
    productId:z.string().refine(objectIdRule, {
      message: 'Invalid ObjectId',
    })
  
  })
  .strict();

