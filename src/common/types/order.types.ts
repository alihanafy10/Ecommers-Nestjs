import { z } from "zod";

import { cancelOrderBodyDto, createOrderBodyDto, getAllOredrQueryDto } from "../../modules/order/dto";




  export type TcreateOrderBodyDto = z.infer<typeof createOrderBodyDto>;
  export type TcancelOrderBodyDto = z.infer<typeof cancelOrderBodyDto>;
  export type TgetAllOredrQueryDto = z.infer<typeof getAllOredrQueryDto>;

