import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthService } from './auth.service';
import { createFileUploadPipe } from '../../common/utils';
import { ZodValidationPipe } from '../../common/pipes';
import { forgetPasswordBodyDto, resetPasswordBodyDto, signInBodyDto, signUpBodyDto, twoStageSignupWithGoogleDto } from './dto';
import { TforgetPasswordBodyDto, TresetPasswordBodyDto, TsignInBodyDto, TsignUpBodyDto, TtwoStageSignupWithGoogleDto } from '../../common/types';

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
    @Param('token') token: string,
    @Res() res: Response,
  ): Promise<Response> {
    await this.authService.verifyEmaill(token);
    return res.status(200).json({ message: 'Verified email successfully' });
  }

  @Post('signin')
  async signIn(
    @Body(new ZodValidationPipe(signInBodyDto)) body: TsignInBodyDto,
    @Res() res: Response,
  ): Promise<Response> {
    const token = await this.authService.signIn(body);
    return res.status(201).json({ message: 'Signing in successfully', token });
  }

  @Post('loginWithGoogle')
  async signinWithGoogle(
    @Body('token') token: string,
    @Res() res: Response,
  ): Promise<Response> {
    {
      const data: string = await this.authService.signinWithGoogle(token);
      return res
        .status(201)
        .json({ message: 'Signing in successfully', token: data });
    }
  }

  @Post('signupWithGoogle')
  async signupWithGoogle(
    @Body('token') token: string,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.authService.signupWithGoogle(token);
    return res.status(201).json({ message: 'signup successfully', data });
  }

  @Post('signupWithGoogleTwo')
  async signupWithGoogleTwo(
    @Body(new ZodValidationPipe(twoStageSignupWithGoogleDto))
    body: TtwoStageSignupWithGoogleDto,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.authService.twoStagesignupWithGoogle(body);
    return res.status(201).json({ message: 'signup successfully', data });
  }

  @Post('forgetPassword')
  async forgetPassword(
    @Body(new ZodValidationPipe(forgetPasswordBodyDto))
    body: TforgetPasswordBodyDto,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.authService.forgetPassword(body);
    return res.status(201).json({ message: data });
  }

  @Post('resetPassword')
  async resetPassword(
    @Body(new ZodValidationPipe(resetPasswordBodyDto))
    body: TresetPasswordBodyDto,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.authService.resetPassword(body);
    return res.status(201).json({ message: data });
  }
}

