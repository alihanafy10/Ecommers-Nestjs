import { z } from "zod";
import { addToCartBodyDto, deleteFromCartParamsDto } from "../../modules/cart/dto";


  export type TaddToCartBodyDto = z.infer<typeof addToCartBodyDto>;
  export type TdeleteFromCartParamsDto = z.infer<typeof deleteFromCartParamsDto>;