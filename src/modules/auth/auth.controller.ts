import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserResponseEntity } from './entities/user.reponse.entity';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: UserResponseEntity) {
    return {
      message: `Successfully get profile ${user.username}`,
      data: user,
    };
  }

  // Google OAuth routes
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(): Promise<void> {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user;

    const token = this.authService.generateToken(user!.id, user!.email);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false, // true in production HTTPS
      sameSite: 'lax',
    });

    res.redirect('http://localhost:5173/dashboard');
  }
}
