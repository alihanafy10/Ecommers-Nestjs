import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AddressModel, UserModel } from "../../common/schemas";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { EmailModule } from "../../services/email/email.module";

@Module({
  imports: [UserModel, AddressModel, CloudinaryModule, EmailModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}