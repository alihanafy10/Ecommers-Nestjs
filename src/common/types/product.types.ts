import { z } from 'zod';

import { createProductBodyDto, getAllProductQueryDto, updateProductBodyDto, updateProductparamDto } from '../../modules/product/dto';



  
  export type TcreateProductBodyDto = z.infer<typeof createProductBodyDto>;
  export type TupdateProductBodyDto = z.infer<typeof updateProductBodyDto>;
  export type TupdateProductparamDto = z.infer<typeof updateProductparamDto>;
  export type TgetAllProductQueryDto = z.infer<typeof getAllProductQueryDto>;

