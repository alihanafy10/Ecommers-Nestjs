import { z } from 'zod';

import { forgetPasswordBodyDto, resetPasswordBodyDto, signInBodyDto, signUpBodyDto, twoStageSignupWithGoogleDto } from '../../modules/auth/dto';

export type TsignUpBodyDto = z.infer<typeof signUpBodyDto>;
export type TsignInBodyDto = z.infer<typeof signInBodyDto>;
export type TtwoStageSignupWithGoogleDto = z.infer<typeof twoStageSignupWithGoogleDto>;
export type TforgetPasswordBodyDto = z.infer<typeof forgetPasswordBodyDto>;
export type TresetPasswordBodyDto = z.infer<typeof resetPasswordBodyDto>;
