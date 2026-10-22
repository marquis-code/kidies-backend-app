import { ConfigService } from '@nestjs/config';
export declare class UploadService {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    uploadImage(file: Express.Multer.File): Promise<any>;
    private uploadToCloudinary;
    private saveLocally;
}
