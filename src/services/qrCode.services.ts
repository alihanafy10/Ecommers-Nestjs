import { Injectable } from '@nestjs/common';
import * as qrcode from 'qrcode';

@Injectable()
export class QrCodeService {
  async generateQrCode(data: any): Promise<string> {
    try {
      const qrCodeDataURL = await qrcode.toDataURL(JSON.stringify(data));
      return qrCodeDataURL;
    } catch (error) {
      throw new Error('Failed to generate QR code.');
    }
  }
}