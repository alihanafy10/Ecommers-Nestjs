import {
  updatePasswordBodyDto,
  updateUserBodyDto,
  updateUserTypeBodyDto,
  updateUserTypeParamsDto,
} from '../../modules/user/dto';
import { z } from 'zod';

export type TupdateUserBodyDto = z.infer<typeof updateUserBodyDto>;
export type TupdateUserTypeBodyDto = z.infer<typeof updateUserTypeBodyDto>;
export type TupdateUserTypeParamsDto = z.infer<typeof updateUserTypeParamsDto>;
export type TupdatePasswordBodyDto = z.infer<typeof updatePasswordBodyDto>;
