"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
const config_1 = require("@nestjs/config");
const fs_1 = require("fs");
const path_1 = require("path");
const crypto_1 = require("crypto");
let UploadService = UploadService_1 = class UploadService {
    configService;
    logger = new common_1.Logger(UploadService_1.name);
    constructor(configService) {
        this.configService = configService;
        cloudinary_1.v2.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });
    }
    async uploadImage(file) {
        if (!file)
            throw new common_1.BadRequestException('No file was uploaded');
        if (!file.mimetype?.startsWith('image/')) {
            throw new common_1.BadRequestException('Only image files are allowed');
        }
        const configured = this.configService.get('CLOUDINARY_CLOUD_NAME') &&
            this.configService.get('CLOUDINARY_API_KEY') &&
            this.configService.get('CLOUDINARY_API_SECRET');
        if (configured) {
            try {
                return await this.uploadToCloudinary(file);
            }
            catch (error) {
                this.logger.warn(`Cloudinary upload failed (${error?.message || error}). Falling back to local storage.`);
            }
        }
        return this.saveLocally(file);
    }
    uploadToCloudinary(file) {
        return new Promise((resolve, reject) => {
            const upload = cloudinary_1.v2.uploader.upload_stream({ folder: 'jasmarkids', resource_type: 'image' }, (error, result) => {
                if (error)
                    return reject(error);
                resolve(result);
            });
            const stream = require('stream');
            const bufferStream = new stream.PassThrough();
            bufferStream.end(file.buffer);
            bufferStream.pipe(upload);
        });
    }
    async saveLocally(file) {
        const uploadsDir = (0, path_1.join)(process.cwd(), 'uploads');
        await fs_1.promises.mkdir(uploadsDir, { recursive: true });
        const ext = (file.originalname || '').includes('.')
            ? `.${file.originalname.split('.').pop()?.toLowerCase()}`
            : '.jpg';
        const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'].includes(ext) ? ext : '.jpg';
        const publicId = `${(0, crypto_1.randomUUID)()}${safeExt}`;
        await fs_1.promises.writeFile((0, path_1.join)(uploadsDir, publicId), file.buffer);
        const base = process.env.PUBLIC_API_URL || `http://localhost:${process.env.PORT || 3005}`;
        return { secure_url: `${base}/uploads/${publicId}`, public_id: publicId };
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = UploadService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadService);
//# sourceMappingURL=upload.service.js.map