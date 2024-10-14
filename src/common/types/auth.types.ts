import { z } from "zod";

import { signUpBodyDto } from "../../modules/auth/dto";

export type TsignUpBodyDto = z.infer<typeof signUpBodyDto>;