import { z } from "zod";

import {  objectIdRule } from "../../../common/shared";


export const updateReviewBodyDto = z
  .object({
    accept:z.boolean().optional(),
    reject:z.boolean().optional()
  })
  .strict();

  export const updateReviewParamsDto = z
  .object({
  
    _id:z.string().refine(objectIdRule, {
      message: 'Invalid ObjectId',
    }),
   
  })
  .strict();