import { z } from "zod";

import { generalRules, objectIdRule, PaymentMethodType } from "../../../common/shared";


export const createOrderBodyDto = z
  .object({
    address:z.string(),
    addressId:z.string().refine(objectIdRule, {
      message: 'Invalid ObjectId',
    }),
    couponCode:z.string(),
    paymentMethod:z.nativeEnum(PaymentMethodType),
    VAT:z.number().positive("maxCount must be a positive integer"),
    shippingFee:z.number().positive("maxCount must be a positive integer"),
    contactNumber:generalRules.phone,
  })
  .strict();