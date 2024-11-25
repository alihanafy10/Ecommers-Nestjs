import { z } from 'zod';

  import { createCategoriesBodyDto } from '../../modules/categories/dto/index';
  
  export type TcreateCategoriesBodyDto = z.infer<typeof createCategoriesBodyDto>;