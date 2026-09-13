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
    verifyOtp(verifyOtpDto: any): Promise<any>;
    resendOtp(resendOtpDto: any): Promise<any>;
    forgotPassword(forgotPasswordDto: any): Promise<any>;
    resetPassword(resetPasswordDto: any): Promise<any>;
    getUsers(): Promise<any[]>;
    getProfile(userId: string): Promise<any>;
    updateProfile(userId: string, updateDto: any): Promise<any>;
    changePassword(userId: string, changePasswordDto: any): Promise<any>;
    addAddress(userId: string, addressDto: any): Promise<any>;
    removeAddress(userId: string, index: number): Promise<any>;
    addPaymentMethod(userId: string, paymentDto: any): Promise<any>;
    removePaymentMethod(userId: string, index: number): Promise<any>;
    toggleWishlist(userId: string, productId: string): Promise<any>;
    updatePreferences(userId: string, prefsDto: any): Promise<any>;
    addBirthday(userId: string, birthdayDto: any): Promise<any>;
    removeBirthday(userId: string, index: number): Promise<any>;
    getDashboard(userId: string): Promise<any>;
}
