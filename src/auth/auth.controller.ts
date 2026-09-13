import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Req, Patch, Delete, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: any) {
    return this.authService.register(registerDto);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() verifyOtpDto: any) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  async resendOtp(@Body() resendOtpDto: any) {
    return this.authService.resendOtp(resendOtpDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: any) {
    return this.authService.login(loginDto);
  }

  @Post('social-login')
  @HttpCode(HttpStatus.OK)
  async socialLogin(@Body() socialDto: any) {
    return this.authService.socialLogin(socialDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: any) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: any) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @UseGuards(JwtGuard)
  @Get('users')
  async getUsers() {
    return this.authService.getUsers();
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  async getProfile(@Req() req: any) {
    const userId = req.user?.sub || req.user?._id || req.user?.id || req.user?.userId || req.user?.email;
    return this.authService.getProfile(userId);
  }

  @UseGuards(JwtGuard)
  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() updateDto: any) {
    const userId = req.user?.sub || req.user?._id;
    return this.authService.updateProfile(userId, updateDto);
  }

  @UseGuards(JwtGuard)
  @Patch('change-password')
  async changePassword(@Req() req: any, @Body() changePasswordDto: any) {
    const userId = req.user?.sub || req.user?._id;
    return this.authService.changePassword(userId, changePasswordDto);
  }

  @UseGuards(JwtGuard)
  @Get('dashboard')
  async getDashboard(@Req() req: any) {
    const userId = req.user?.sub || req.user?._id;
    return this.authService.getDashboard(userId);
  }

  @UseGuards(JwtGuard)
  @Post('addresses')
  async addAddress(@Req() req: any, @Body() addressDto: any) {
    const userId = req.user?.sub || req.user?._id;
    return this.authService.addAddress(userId, addressDto);
  }

  @UseGuards(JwtGuard)
  @Delete('addresses/:index')
  async removeAddress(@Req() req: any, @Param('index') index: string) {
    const userId = req.user?.sub || req.user?._id;
    return this.authService.removeAddress(userId, parseInt(index));
  }

  @UseGuards(JwtGuard)
  @Post('payments')
  async addPaymentMethod(@Req() req: any, @Body() paymentDto: any) {
    const userId = req.user?.sub || req.user?._id;
    return this.authService.addPaymentMethod(userId, paymentDto);
  }

  @UseGuards(JwtGuard)
  @Delete('payments/:index')
  async removePaymentMethod(@Req() req: any, @Param('index') index: string) {
    const userId = req.user?.sub || req.user?._id;
    return this.authService.removePaymentMethod(userId, parseInt(index));
  }

  @UseGuards(JwtGuard)
  @Post('wishlist')
  async toggleWishlist(@Req() req: any, @Body('productId') productId: string) {
    const userId = req.user?.sub || req.user?._id;
    return this.authService.toggleWishlist(userId, productId);
  }

  @UseGuards(JwtGuard)
  @Patch('preferences')
  async updatePreferences(@Req() req: any, @Body() prefsDto: any) {
    const userId = req.user?.sub || req.user?._id;
    return this.authService.updatePreferences(userId, prefsDto);
  }

  @UseGuards(JwtGuard)
  @Post('birthdays')
  async addBirthday(@Req() req: any, @Body() birthdayDto: any) {
    const userId = req.user?.sub || req.user?._id;
    return this.authService.addBirthday(userId, birthdayDto);
  }

  @UseGuards(JwtGuard)
  @Delete('birthdays/:index')
  async removeBirthday(@Req() req: any, @Param('index') index: string) {
    const userId = req.user?.sub || req.user?._id;
    return this.authService.removeBirthday(userId, parseInt(index));
  }
}
