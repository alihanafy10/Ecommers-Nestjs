import { z } from "zod";

import {  objectIdRule } from "../../../common/shared";


export const cancelOrderBodyDto = z
  .object({
  
    _id:z.string().refine(objectIdRule, {
      message: 'Invalid ObjectId',
    }),
   
  })
  .strict();