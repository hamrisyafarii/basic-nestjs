import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.gurad';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserResponseEntity } from './entities/user.reponse.entity';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import type { Request, Response } from 'express';

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
  googleAuthRedirect(@Req() req: Request, @Res() res: Response): void {
    const user = req.user;

    if (!user) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Authentication failed',
        data: null,
      });
      return;
    }

    // generate jwt token
    const accessToken = this.authService.generateToken(user.id, user.email);

    // Redirect to frontend with token
    res.redirect(`http://localhost:5173/auth/callback?token=${accessToken}`);
  }
}
