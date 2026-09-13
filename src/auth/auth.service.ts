import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin is now handled in the constructor to ensure env vars are loaded.

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          project_id: process.env.FIREBASE_PROJECT_ID,
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        } as any),
      });
    }
  }

  async socialLogin(socialDto: any): Promise<any> {
    const { idToken } = socialDto;

    if (!idToken) {
      throw new UnauthorizedException('No ID token provided');
    }

    let decodedToken;
    try {
      decodedToken = await getAuth().verifyIdToken(idToken);
    } catch (error) {
      console.error('Firebase token verification failed', error);
      throw new UnauthorizedException('Invalid ID token');
    }

    const email = decodedToken.email;
    const providerId = decodedToken.uid;
    const displayName = decodedToken.name || '';
    const nameParts = displayName.split(' ');
    const firstName = nameParts[0] || 'Google';
    const lastName = nameParts.slice(1).join(' ') || 'User';
    
    let user = await this.userModel.findOne({ email });
    if (!user) {
      // Create user if not exists
      user = new this.userModel({
        email,
        firstName,
        lastName,
        passwordHash: await bcrypt.hash(providerId || Date.now().toString(), 10),
        isEmailVerified: true // Social login implies verified email
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
  async register(registerDto: any): Promise<any> {
    const { email, password, firstName, lastName } = registerDto;
    
    // Check if user exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const newUser = new this.userModel({
      email,
      firstName,
      lastName,
      passwordHash: password, // Pre-save hook will hash this
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

  async login(loginDto: any): Promise<any> {
    const { email, password } = loginDto;
    
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email address before logging in.');
    }

    const payload = { sub: user._id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    // Refresh token typically has a longer expiration
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

  async verifyOtp(verifyOtpDto: any): Promise<any> {
    const { email, code } = verifyOtpDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    if (user.otpCode !== code) {
      throw new BadRequestException('Invalid OTP code');
    }

    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
      throw new BadRequestException('OTP code has expired');
    }

    // Verify user
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

  async resendOtp(resendOtpDto: any): Promise<any> {
    const { email } = resendOtpDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
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

  async forgotPassword(forgotPasswordDto: any): Promise<any> {
    const { email } = forgotPasswordDto;
    
    const user = await this.userModel.findOne({ email });
    if (!user) {
      // Don't leak whether user exists for security
      return { message: 'If an account exists, a reset link will be sent.' };
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // In a real app, send an email here.
    // For this demonstration, we'll return the token directly so the frontend can use it.
    return { 
      message: 'Password reset token generated. In a real app, this would be emailed.',
      resetToken // EXPOSING FOR DEMO PURPOSES ONLY!
    };
  }

  async resetPassword(resetPasswordDto: any): Promise<any> {
    const { token, newPassword } = resetPasswordDto;
    
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    const user = await this.userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() } // Token must not be expired
    });

    if (!user) {
      throw new BadRequestException('Token is invalid or has expired');
    }

    // Update password
    user.passwordHash = newPassword; // Pre-save hook will hash this
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();

    return { message: 'Password has been reset successfully' };
  }

  async getUsers(): Promise<any[]> {
    return this.userModel.find({}, '-passwordHash -resetPasswordToken -resetPasswordExpires').sort({ createdAt: -1 }).exec();
  }

  async getProfile(userId: string): Promise<any> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
    try {
      const user = await this.userModel.findById(userId, '-passwordHash -resetPasswordToken -resetPasswordExpires');
      if (user) return user;
    } catch (e) {
      // Invalid ObjectId format string
    }

    const user = await this.userModel.findOne({
      $or: [{ email: userId }]
    }, '-passwordHash -resetPasswordToken -resetPasswordExpires');

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(userId: string, updateDto: any): Promise<any> {
    const user = await this.userModel.findByIdAndUpdate(userId, updateDto, { new: true }).select('-passwordHash -resetPasswordToken -resetPasswordExpires');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async changePassword(userId: string, changePasswordDto: any): Promise<any> {
    const { currentPassword, newPassword } = changePasswordDto;
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Incorrect current password');
    }

    user.passwordHash = newPassword; // Pre-save hook hashes it
    await user.save();
    return { message: 'Password updated successfully' };
  }

  async addAddress(userId: string, addressDto: any): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (addressDto.isDefault) {
      user.addresses.forEach((a: any) => (a.isDefault = false));
    }
    user.addresses.push(addressDto);
    await user.save();
    return user.addresses;
  }

  async removeAddress(userId: string, index: number): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (index >= 0 && index < user.addresses.length) {
      user.addresses.splice(index, 1);
      await user.save();
    }
    return user.addresses;
  }

  async addPaymentMethod(userId: string, paymentDto: any): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

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

  async removePaymentMethod(userId: string, index: number): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (index >= 0 && index < user.paymentMethods.length) {
      user.paymentMethods.splice(index, 1);
      await user.save();
    }
    return user.paymentMethods;
  }

  async toggleWishlist(userId: string, productId: string): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const idx = user.wishlist.indexOf(productId);
    if (idx > -1) {
      user.wishlist.splice(idx, 1);
    } else {
      user.wishlist.push(productId);
    }
    await user.save();
    return { wishlist: user.wishlist };
  }

  async updatePreferences(userId: string, prefsDto: any): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.preferences = { ...user.preferences, ...prefsDto };
    await user.save();
    return user.preferences;
  }

  async addBirthday(userId: string, birthdayDto: any): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (user.birthdays.length >= 4) {
      throw new BadRequestException('You can only add up to 4 birthdays.');
    }

    user.birthdays.push(birthdayDto);
    await user.save();
    return user.birthdays;
  }

  async removeBirthday(userId: string, index: number): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (index >= 0 && index < user.birthdays.length) {
      user.birthdays.splice(index, 1);
      await user.save();
    }
    return user.birthdays;
  }

  async getDashboard(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId, '-passwordHash -resetPasswordToken -resetPasswordExpires -otpCode -otpExpiresAt');
    if (!user) throw new NotFoundException('User not found');

    // Calculate tier thresholds
    const tierInfo = {
      current: user.rewardTier,
      points: user.rewardPoints,
      totalSpent: user.totalSpent,
      nextTier: user.rewardTier === 'Insider' ? 'Stylist' : user.rewardTier === 'Stylist' ? 'Icon' : null,
      spendToNextTier: user.rewardTier === 'Insider' ? Math.max(0, 175 - user.totalSpent) : user.rewardTier === 'Stylist' ? Math.max(0, 500 - user.totalSpent) : 0,
      thresholds: { insider: 0, stylist: 175, icon: 500 },
    };

    // Static discounts/offers for demo
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
}
