import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<any> {
    if (!file) throw new BadRequestException('No file was uploaded');
    if (!file.mimetype?.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    const configured =
      this.configService.get<string>('CLOUDINARY_CLOUD_NAME') &&
      this.configService.get<string>('CLOUDINARY_API_KEY') &&
      this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (configured) {
      try {
        return await this.uploadToCloudinary(file);
      } catch (error: any) {
        this.logger.warn(
          `Cloudinary upload failed (${error?.message || error}). Falling back to local storage.`,
        );
      }
    }

    return this.saveLocally(file);
  }

  private uploadToCloudinary(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'jasmarkids', resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      const stream = require('stream');
      const bufferStream = new stream.PassThrough();
      bufferStream.end(file.buffer);
      bufferStream.pipe(upload);
    });
  }

  private async saveLocally(file: Express.Multer.File): Promise<any> {
    const uploadsDir = join(process.cwd(), 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    const ext = (file.originalname || '').includes('.')
      ? `.${file.originalname.split('.').pop()?.toLowerCase()}`
      : '.jpg';
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'].includes(ext) ? ext : '.jpg';
    const publicId = `${randomUUID()}${safeExt}`;
    await fs.writeFile(join(uploadsDir, publicId), file.buffer);
    const base = process.env.PUBLIC_API_URL || `http://localhost:${process.env.PORT || 3005}`;
    return { secure_url: `${base}/uploads/${publicId}`, public_id: publicId };
  }
}
