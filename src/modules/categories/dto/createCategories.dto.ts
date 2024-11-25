import { z } from "zod";

import { objectIdRule } from "../../../common/shared";

export const createCategoriesBodyDto = z
  .object({
    name:z.string().trim().min(3).max(20),
    createdBy:z.string().refine(objectIdRule, {
        message: 'Invalid ObjectId of createdBy',
      }),
      customId:z.string().nanoid().min(5)
  })
  .strict();