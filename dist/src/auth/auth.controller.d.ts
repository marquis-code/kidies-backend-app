import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: any): Promise<any>;
    login(loginDto: any): Promise<any>;
    socialLogin(socialDto: any): Promise<any>;
    forgotPassword(forgotPasswordDto: any): Promise<any>;
    resetPassword(resetPasswordDto: any): Promise<any>;
    getUsers(): Promise<any[]>;
    getProfile(req: any): Promise<any>;
}
