import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) {}

  async socialLogin(socialDto: any): Promise<any> {
    const { email, firstName, lastName, providerId } = socialDto;
    
    let user = await this.userModel.findOne({ email });
    if (!user) {
      // Create user if not exists
      user = new this.userModel({
        email,
        firstName: firstName || 'Google',
        lastName: lastName || 'User',
        passwordHash: await bcrypt.hash(providerId || Date.now().toString(), 10)
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

    const newUser = new this.userModel({
      email,
      firstName,
      lastName,
      passwordHash: password // Pre-save hook will hash this
    });

    await newUser.save();
    
    return {
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      }
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
    const user = await this.userModel.findById(userId, '-passwordHash -resetPasswordToken -resetPasswordExpires');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
