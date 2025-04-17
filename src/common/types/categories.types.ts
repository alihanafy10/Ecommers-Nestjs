import { z } from 'zod';

  import { createCategoriesBodyDto, getAllCategorieQueryDto, getCategorieQueryDto, updateCategoriesBodyDto, updateCategoriesParamsDto } from '../../modules/categories/dto/index';
  
  export type TcreateCategoriesBodyDto = z.infer<typeof createCategoriesBodyDto>;
  export type TupdateCategoriesBodyDto = z.infer<typeof updateCategoriesBodyDto>;
  export type TupdateCategoriesParamsDto = z.infer<typeof updateCategoriesParamsDto>;
  export type TgetCategorieQueryDto = z.infer<typeof getCategorieQueryDto>;
  export type TgetAllCategorieQueryDto = z.infer<typeof getAllCategorieQueryDto>;