import { Body, Controller, Delete, Get, Param, Put, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import { UserService } from "./user.service";
import { TupdatePasswordBodyDto, TupdateUserBodyDto, TupdateUserTypeBodyDto, TupdateUserTypeParamsDto } from "../../common/types";
import { Auth } from "../../common/decorator";
import { UserType } from "../../common/shared";
import { ZodValidationPipe } from "../../common/pipes";
import { updatePasswordBodyDto, updateUserBodyDto, updateUserTypeBodyDto, updateUserTypeParamsDto } from "./dto";
import { createFileUploadPipe } from '../../common/utils';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('updateUser')
  @UseInterceptors(FileInterceptor('image'))
  @Auth([UserType.BUYER, UserType.ADMIN])
  async updateUser(
    @Req() req: Request,
    @Res() res: Response,
    @Body(new ZodValidationPipe(updateUserBodyDto)) body: TupdateUserBodyDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Response> {
     //If the file exists from it via => createFileUploadPipe
     if (file) {
      await createFileUploadPipe().transform(file);
    }
    const data = await this.userService.updateUser(body, req, file);
    return res.status(201).json({ message: 'updated successfully', data });
  }

  @Put('updateUserType/:userId')
  @Auth([UserType.ADMIN])
  async updateUserType(
    @Body(new ZodValidationPipe(updateUserTypeBodyDto))
    body: TupdateUserTypeBodyDto,
    @Param(new ZodValidationPipe(updateUserTypeParamsDto))
    param: TupdateUserTypeParamsDto,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.userService.updateUserType(body, param);
    return res.status(201).json({ message: 'updated successfully', data });
  }

  @Put('updatePass')
  @Auth([UserType.ADMIN, UserType.BUYER])
  async updatePass(
    @Body(new ZodValidationPipe(updatePasswordBodyDto))
    body: TupdatePasswordBodyDto,
    @Req() req:Request,
    @Res() res: Response
  ):Promise<Response> {
    await this.userService.updatePass(body, req);
    return res.status(201).json({ message: 'updated successfully'});
  }

  @Get('profileInfo')
  @Auth([UserType.ADMIN, UserType.BUYER])
  async profileInfo(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const authUser=req['authUser']
    const data = await this.userService.profileInfo(authUser);
    return res.status(200).json({ data });
  }

  @Delete('deleteProfile')
  @Auth([UserType.ADMIN, UserType.BUYER])
  async deleteProfile(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const authUser=req['authUser']
    await this.userService.deleteProfile(authUser);
    return res.status(201).json({ message: 'deleted successfully' });
  }
}

