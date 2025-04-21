import { z } from 'zod';

import { addReviewBodyDto, updateReviewBodyDto, updateReviewParamsDto } from '../../modules/review/dto';



  
  export type TaddReviewBodyDto = z.infer<typeof addReviewBodyDto>;
  export type TupdateReviewBodyDto = z.infer<typeof updateReviewBodyDto>;
  export type TupdateReviewParamsDto = z.infer<typeof updateReviewParamsDto>;
 

