
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

import { CloudinaryResponse } from './cloudinary-response';

interface CloudinaryObj{
  folder: string;
  public_id?: string;
}

@Injectable()
export class CloudinaryService {
  //uploade image from device
  uploadFile(
    file: Express.Multer.File,
    options: CloudinaryObj,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  //uploade online image form goole ..
  async uploadeImage(imagePath: string, options: CloudinaryObj):Promise<UploadApiResponse> {
    try {
      // Upload the image
      const result = await cloudinary.uploader.upload(imagePath, options);
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}
