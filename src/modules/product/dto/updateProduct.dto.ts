import { z } from "zod";

import { DiscountType,generalRules, ProductBadges } from "../../../common/shared";


export const updateProductBodyDto = z
  .object({
    name:z.string().trim().min(3).max(20).optional(),
    overview:z.string().trim().max(500).optional(),
    specs:z.preprocess((val)=> JSON.parse(val as string),z.record(z.union([z.string(), z.preprocess((val) => +val, z.number().int())]))).optional(),
    badges:z.nativeEnum(ProductBadges).optional(),
    price:z.preprocess((val) => +val, z.number().int()).optional(),
    amount:z.preprocess((val) => +val, z.number().int()).optional(),
    type:z.nativeEnum(DiscountType).optional(),
    stock:z.preprocess((val) => +val, z.number().int().min(1)).optional(),
    public_id:z.string().optional()
  })
  .strict();

export const updateProductparamDto = z
  .object({
    _id:generalRules.IdesRole,
  })
  .strict();