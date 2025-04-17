import { z } from "zod";

import { objectIdRule } from "../../../common/shared";


export const updateCategoriesBodyDto = z
  .object({
    name:z.string().trim().min(3).max(20).optional(),
  })
  .strict();

export const updateCategoriesParamsDto = z
  .object({
    _id:z.string().refine(objectIdRule, {
        message: 'Invalid ObjectId',
      }),
  })
  .strict();