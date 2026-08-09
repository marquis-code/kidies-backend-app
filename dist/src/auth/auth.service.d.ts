import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from './schemas/user.schema';
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    socialLogin(socialDto: any): Promise<any>;
    register(registerDto: any): Promise<any>;
    login(loginDto: any): Promise<any>;
    forgotPassword(forgotPasswordDto: any): Promise<any>;
    resetPassword(resetPasswordDto: any): Promise<any>;
    getUsers(): Promise<any[]>;
    getProfile(userId: string): Promise<any>;
}
