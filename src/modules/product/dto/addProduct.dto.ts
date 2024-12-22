import { z } from "zod";

import { DiscountType,generalRules } from "../../../common/shared";


export const createProductBodyDto = z
  .object({
    name:z.string().trim().min(3).max(20),
    overview:z.string().trim().max(500),
    specs:z.preprocess((val)=> JSON.parse(val as string),z.record(z.union([z.string(), z.preprocess((val) => +val, z.number().int())]))),
    price:z.preprocess((val) => +val, z.number().int()),
    amount:z.preprocess((val) => +val, z.number().int()),
    type:z.nativeEnum(DiscountType),
    stock:z.preprocess((val) => +val, z.number().int().min(1)),

    categoryId:generalRules.IdesRole,
    subCategoryId:generalRules.IdesRole,
    brandId:generalRules.IdesRole,
  })
  .strict();