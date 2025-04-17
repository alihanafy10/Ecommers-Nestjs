import { Module } from "@nestjs/common";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { JwtService } from "@nestjs/jwt";
import { UserModel } from "../../common/schemas";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { EmailModule } from "../../services/email/email.module";

@Module({
  imports: [UserModel,CloudinaryModule,EmailModule],
  controllers: [UserController],
  providers: [UserService, JwtService],
})
export class UserModule {}