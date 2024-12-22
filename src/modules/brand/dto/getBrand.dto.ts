import { z } from "zod";

import { getAllCategorieQueryDto, getCategorieQueryDto } from "../../../modules/categories/dto";
import { objectIdRule } from "../../../common/shared";

export const getBrandQueryDto = getCategorieQueryDto
export const getAllBrandQueryDto = getAllCategorieQueryDto
export const getAllBrandSCNQueryDto = z
  .object({
    name:z.string().trim().min(3).max(20).optional(),
    slug:z.string().trim().min(3).max(20).optional(),
    subCategory:z.string().refine(objectIdRule, {
        message: 'Invalid ObjectId',
      }).optional(),
      category:z.string().refine(objectIdRule, {
        message: 'Invalid ObjectId',
      }).optional(),
  })
  .strict();