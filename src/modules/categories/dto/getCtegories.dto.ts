import { z } from "zod";

import { objectIdRule } from "../../../common/shared";


export const getCategorieQueryDto = z
  .object({
    name:z.string().trim().min(3).max(20).optional(),
    slug:z.string().trim().min(3).max(20).optional(),
    _id:z.string().refine(objectIdRule, {
        message: 'Invalid ObjectId',
      }).optional(),
  })
  .strict();
  
export const getAllCategorieQueryDto = z
  .object({
    page:z.preprocess((val) => +val, z.number().min(1).max(50)).optional(),
    limit:z.preprocess((val) => +val, z.number().min(1).max(100)).optional(),
  })
  .strict();