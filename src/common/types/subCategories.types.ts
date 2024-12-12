import { z } from 'zod';

import { updateSubCategoriesBodyDto, updateSubCategoriesParamsDto } from '../../modules/subCategories/dto/updateSubCategories.dto';
import { createSubCategoriesBodyDto, getAllSubCategoriesQueryDto, getSubCategorieQueryDto } from '../../modules/subCategories/dto';


  
  export type TcreateSubCategoriesBodyDto = z.infer<typeof createSubCategoriesBodyDto>;
  export type TupdateSubCategoriesParamsDto = z.infer<typeof updateSubCategoriesParamsDto>;
  export type TupdateSubCategoriesBodyDto = z.infer<typeof updateSubCategoriesBodyDto>;
  export type TgetSubCategorieQueryDto = z.infer<typeof getSubCategorieQueryDto>;
  export type TgetAllSubCategoriesQueryDto = z.infer<typeof getAllSubCategoriesQueryDto>;
