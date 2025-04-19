import { z } from "zod";

import { createCouponBodyDto, getAllCouponQueryDto, getCouponParamsDto, patchCouponBodyDto, patchCouponParamsDto, updateCouponBodyDto } from "../../modules/coupon/dto";


  export type TcreateCouponBodyDto = z.infer<typeof createCouponBodyDto>;
  export type TgetCouponParamsDto = z.infer<typeof getCouponParamsDto>;
  export type TgetAllCouponQueryDto = z.infer<typeof getAllCouponQueryDto>;
  export type TpatchCouponBodyDto = z.infer<typeof patchCouponBodyDto>;
  export type TpatchCouponParamsDto = z.infer<typeof patchCouponParamsDto>;
  export type TupdateCouponBodyDto = z.infer<typeof updateCouponBodyDto>;
