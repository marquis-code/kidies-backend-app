"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_1 = require("@nestjs/jwt");
const user_schema_1 = require("./schemas/user.schema");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
let AuthService = class AuthService {
    userModel;
    jwtService;
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        if (!(0, app_1.getApps)().length) {
            (0, app_1.initializeApp)({
                credential: (0, app_1.cert)({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                    project_id: process.env.FIREBASE_PROJECT_ID,
                    client_email: process.env.FIREBASE_CLIENT_EMAIL,
                    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                }),
            });
        }
    }
    async socialLogin(socialDto) {
        const { idToken } = socialDto;
        if (!idToken) {
            throw new common_1.UnauthorizedException('No ID token provided');
        }
        let decodedToken;
        try {
            decodedToken = await (0, auth_1.getAuth)().verifyIdToken(idToken);
        }
        catch (error) {
            console.error('Firebase token verification failed', error);
            throw new common_1.UnauthorizedException('Invalid ID token');
        }
        const email = decodedToken.email;
        const providerId = decodedToken.uid;
        const displayName = decodedToken.name || '';
        const nameParts = displayName.split(' ');
        const firstName = nameParts[0] || 'Google';
        const lastName = nameParts.slice(1).join(' ') || 'User';
        let user = await this.userModel.findOne({ email });
        if (!user) {
            user = new this.userModel({
                email,
                firstName,
                lastName,
                passwordHash: await bcrypt.hash(providerId || Date.now().toString(), 10),
                isEmailVerified: true
            });
            await user.save();
        }
        const payload = { sub: user._id, email: user.email };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        return {
            message: 'Social login successful',
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        };
    }
    async register(registerDto) {
        const { email, password, firstName, lastName } = registerDto;
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new common_1.BadRequestException('User with this email already exists');
        }
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
        const newUser = new this.userModel({
            email,
            firstName,
            lastName,
            passwordHash: password,
            isEmailVerified: false,
            otpCode,
            otpExpiresAt,
        });
        await newUser.save();
        return {
            message: 'User registered successfully. Please verify your email with the OTP sent.',
            requiresOtp: true,
            email: newUser.email
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isEmailVerified) {
            throw new common_1.UnauthorizedException('Please verify your email address before logging in.');
        }
        const payload = { sub: user._id, email: user.email };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });
        return {
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        };
    }
    async verifyOtp(verifyOtpDto) {
        const { email, code } = verifyOtpDto;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.isEmailVerified) {
            throw new common_1.BadRequestException('Email is already verified');
        }
        if (user.otpCode !== code) {
            throw new common_1.BadRequestException('Invalid OTP code');
        }
        if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
            throw new common_1.BadRequestException('OTP code has expired');
        }
        user.isEmailVerified = true;
        user.otpCode = undefined;
        user.otpExpiresAt = undefined;
        await user.save();
        const payload = { sub: user._id, email: user.email };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });
        return {
            message: 'Email verified successfully',
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        };
    }
    async resendOtp(resendOtpDto) {
        const { email } = resendOtpDto;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.isEmailVerified) {
            throw new common_1.BadRequestException('Email is already verified');
        }
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
        user.otpCode = otpCode;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();
        return {
            message: 'A new OTP has been sent to your email address.',
            email: user.email
        };
    }
    async forgotPassword(forgotPasswordDto) {
        const { email } = forgotPasswordDto;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            return { message: 'If an account exists, a reset link will be sent.' };
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000);
        await user.save();
        return {
            message: 'Password reset token generated. In a real app, this would be emailed.',
            resetToken
        };
    }
    async resetPassword(resetPasswordDto) {
        const { token, newPassword } = resetPasswordDto;
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await this.userModel.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: new Date() }
        });
        if (!user) {
            throw new common_1.BadRequestException('Token is invalid or has expired');
        }
        user.passwordHash = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        return { message: 'Password has been reset successfully' };
    }
    async getUsers() {
        return this.userModel.find({}, '-passwordHash -resetPasswordToken -resetPasswordExpires').sort({ createdAt: -1 }).exec();
    }
    async getProfile(userId) {
        if (!userId) {
            throw new common_1.BadRequestException('User ID is required');
        }
        try {
            const user = await this.userModel.findById(userId, '-passwordHash -resetPasswordToken -resetPasswordExpires');
            if (user)
                return user;
        }
        catch (e) {
        }
        const user = await this.userModel.findOne({
            $or: [{ email: userId }]
        }, '-passwordHash -resetPasswordToken -resetPasswordExpires');
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async updateProfile(userId, updateDto) {
        const user = await this.userModel.findByIdAndUpdate(userId, updateDto, { new: true }).select('-passwordHash -resetPasswordToken -resetPasswordExpires');
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async changePassword(userId, changePasswordDto) {
        const { currentPassword, newPassword } = changePasswordDto;
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Incorrect current password');
        }
        user.passwordHash = newPassword;
        await user.save();
        return { message: 'Password updated successfully' };
    }
    async addAddress(userId, addressDto) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (addressDto.isDefault) {
            user.addresses.forEach((a) => (a.isDefault = false));
        }
        user.addresses.push(addressDto);
        await user.save();
        return user.addresses;
    }
    async removeAddress(userId, index) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (index >= 0 && index < user.addresses.length) {
            user.addresses.splice(index, 1);
            await user.save();
        }
        return user.addresses;
    }
    async addPaymentMethod(userId, paymentDto) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        user.paymentMethods.push({
            type: paymentDto.type || 'credit_card',
            last4: paymentDto.last4,
            brand: paymentDto.brand || 'Visa',
            expiryMonth: paymentDto.expiryMonth,
            expiryYear: paymentDto.expiryYear,
            isDefault: paymentDto.isDefault || false,
        });
        await user.save();
        return user.paymentMethods;
    }
    async removePaymentMethod(userId, index) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (index >= 0 && index < user.paymentMethods.length) {
            user.paymentMethods.splice(index, 1);
            await user.save();
        }
        return user.paymentMethods;
    }
    async toggleWishlist(userId, productId) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const idx = user.wishlist.indexOf(productId);
        if (idx > -1) {
            user.wishlist.splice(idx, 1);
        }
        else {
            user.wishlist.push(productId);
        }
        await user.save();
        return { wishlist: user.wishlist };
    }
    async updatePreferences(userId, prefsDto) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        user.preferences = { ...user.preferences, ...prefsDto };
        await user.save();
        return user.preferences;
    }
    async addBirthday(userId, birthdayDto) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.birthdays.length >= 4) {
            throw new common_1.BadRequestException('You can only add up to 4 birthdays.');
        }
        user.birthdays.push(birthdayDto);
        await user.save();
        return user.birthdays;
    }
    async removeBirthday(userId, index) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (index >= 0 && index < user.birthdays.length) {
            user.birthdays.splice(index, 1);
            await user.save();
        }
        return user.birthdays;
    }
    async getDashboard(userId) {
        const user = await this.userModel.findById(userId, '-passwordHash -resetPasswordToken -resetPasswordExpires -otpCode -otpExpiresAt');
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const tierInfo = {
            current: user.rewardTier,
            points: user.rewardPoints,
            totalSpent: user.totalSpent,
            nextTier: user.rewardTier === 'Insider' ? 'Stylist' : user.rewardTier === 'Stylist' ? 'Icon' : null,
            spendToNextTier: user.rewardTier === 'Insider' ? Math.max(0, 175 - user.totalSpent) : user.rewardTier === 'Stylist' ? Math.max(0, 500 - user.totalSpent) : 0,
            thresholds: { insider: 0, stylist: 175, icon: 500 },
        };
        const discounts = user.discounts.length > 0 ? user.discounts : [
            { code: 'EXTRA40', description: 'EXTRA 40% OFF GYM CLEARANCE!', discountPercent: 40, validUntil: new Date('2027-09-15'), type: 'savings' },
            { code: 'FREESHIP', description: 'Free Standard Gift Service', discountPercent: 0, validUntil: new Date('2027-09-30'), type: 'offer' },
        ];
        const earnPointsActions = [
            { action: 'Take a Survey', points: 10, icon: 'clipboard' },
            { action: 'Add a mailing address', points: 10, icon: 'mail' },
            { action: 'Add Your Favorite Store', points: 10, icon: 'store' },
            { action: 'Add Your Birthday', points: 5, icon: 'cake' },
        ];
        return {
            user,
            tierInfo,
            discounts,
            earnPointsActions,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map