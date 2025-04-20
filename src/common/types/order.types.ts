import { z } from "zod";

import { createOrderBodyDto } from "../../modules/order/dto";




  export type TcreateOrderBodyDto = z.infer<typeof createOrderBodyDto>;

