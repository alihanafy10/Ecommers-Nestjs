import { z } from "zod";

import { objectIdRule } from "../../../common/shared";


export const createSubCategoriesBodyDto = z
  .object({
    name:z.string().trim().min(3).max(20),
    categoryId:z.string().refine(objectIdRule, {
      message: 'Invalid ObjectId',
    }),
  })
  .strict();