import { z } from 'zod';

import { createBrandBodyDto, getAllBrandQueryDto, getAllBrandSCNQueryDto, getBrandQueryDto, updateBrandBodyDto, updateBrandParamsDto } from '../../modules/brand/dto';


  
  export type TcreateBrandBodyDto = z.infer<typeof createBrandBodyDto>;
  export type TupdateBrandBodyDto = z.infer<typeof updateBrandBodyDto>;
  export type TupdateBrandParamsDto = z.infer<typeof updateBrandParamsDto>;
  export type TgetBrandQueryDto = z.infer<typeof getBrandQueryDto>;
  export type TgetAllBrandQueryDto = z.infer<typeof getAllBrandQueryDto>;
  export type TgetAllBrandSCNQueryDto = z.infer<typeof getAllBrandSCNQueryDto>;
 
 