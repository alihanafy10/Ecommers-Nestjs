import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";


import { Address, User } from "../../common/schemas";
import { TsignUpBodyDto } from "../../common/types";
import { validateLocation } from "../../common/utils";
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { EmailService } from "../../services/email/email.service";


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Address.name) private addressModel: Model<Address>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  /**
   * @param {TsignUpBodyDto} body
   * @param {Request} req
   * @param {Express.Multer.File} file? - The optional user profile image file
   *
   * @returns {userObj,addressObj}.
   *
   * @throws {BadRequestException} - If the provided email already exists in the system.
   */
  async signUp(
    body: TsignUpBodyDto,
    req: Request,
    file?: Express.Multer.File,
  ): Promise<any> {
    //featch data from body
    const {
      userName,
      email,
      password,
      userType,
      age,
      gender,
      phone,
      country,
      city,
      postalCode,
      builidingNumber,
      flooreNumber,
      addressLable,
    } = body;
    //cheak email exists
    const isEmailExists = await this.userModel.findOne({ email });
    if (isEmailExists) {
      throw new BadRequestException('email already exists');
    }
    //validation of country
    await validateLocation('country', country);
    //validation of city
    await validateLocation('city', city);
    //uploade image
    let secure_url: string, public_id: string;
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadFile(file, {
        folder: `${process.env.UPLOADE_FOLDER}/Users`,
      });
      secure_url = uploadResult.secure_url;
      public_id = uploadResult.public_id;
    } else {
      secure_url = process.env.IMAGE_SECURE_URL;
      public_id = process.env.IMAGE_PUBLIC_ID;
    }
    //obj of user
    const userObj = new this.userModel({
      userName,
      email,
      password,
      userType,
      age,
      gender,
      phone,
      image: {
        secure_url,
        public_id,
      },
    });
    //save data user
    await userObj.save();
    //send email
    await this.emailService.sendEmails(email, userName, req);
    //address object
    const addressObj = new this.addressModel({
      userId: userObj._id,
      country,
      city,
      postalCode,
      builidingNumber,
      flooreNumber,
      addressLable,
      isDefualt: true,
    });
    //save address
    await addressObj.save();

    return { userObj, addressObj };
  }

  /**
   * verify Email
   * @param {string} token - The JWT token containing the user's email.
   * @throws {UnauthorizedException} If the token is invalid or expired.
   */
  async verifyEmaill(token: string): Promise<void> {
    try {
      //verify token
      const data = await this.jwtService.verify(token, {
        secret: process.env.VERIFY_TOKEN_EMAIL,
      });
      if (!data) throw new UnauthorizedException('Invalid or expired token');
      //change emailVerification to true
      await this.userModel.findOneAndUpdate(
        { email: data.email },
        { isEmailVerified: true },
      );
    } catch (error) {
      throw new UnauthorizedException('Token verification failed');
    }
  }
}

