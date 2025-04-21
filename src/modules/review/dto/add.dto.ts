import { z } from "zod";

import {  objectIdRule } from "../../../common/shared";


export const addReviewBodyDto = z
  .object({
    productId:z.string().refine(objectIdRule, {
      message: 'Invalid ObjectId',
    }),
    reviewRating:z.number().min(1).max(5).int().positive("maxCount must be a positive integer"),
    rewiewBody:z.string().max(500)
  })
  .strict();