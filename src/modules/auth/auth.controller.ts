import { Body, Controller, Get, Param, Post, Req, Res, UploadedFile, UseInterceptors, UsePipes } from "@nestjs/common";
import { Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";

import { AuthService } from "./auth.service";
import {createFileUploadPipe} from '../../common/utils'
import { ZodValidationPipe } from "../../common/pipes";
import { signUpBodyDto } from "./dto";
import { TsignUpBodyDto } from "../../common/types";



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor('image'))
  async signUp(
    @Body(new ZodValidationPipe(signUpBodyDto)) body: TsignUpBodyDto,
    @Res() res: Response,
    @Req() req: Request,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Response> {
    //If the file exists from it via => createFileUploadPipe
    if (file) {
      await createFileUploadPipe().transform(file);
    }
    const data = await this.authService.signUp(body, req, file);
    return res.status(201).json({ message: 'created successfully', data });
  }

  @Get('verifyEmail/:token')
  async verifyEmail(
    @Param('token') token:string,
    @Res() res: Response
  ) {
    await this.authService.verifyEmaill(token)
    res.status(200).json({ message: 'Verified email successfully' });
  }
}
