import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { RegisterDto } from './dto/register.dto';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { AuthResponseEntity } from './entities/auth.response.entity';
import bcrypt from 'bcrypt';
import { UserResponseEntity } from './entities/user.reponse.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<ApiResponse<AuthResponseEntity>> {
    const existingEmail = await this.authRepository.findByEmail(
      registerDto.email,
    );
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // Check if username already exists
    const existingUsername = await this.authRepository.findByUsername(
      registerDto.username,
    );
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = await this.authRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    // Generate token
    const accessToken = this.generateToken(user.id, user.email);

    const userResponse: UserResponseEntity = {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name || undefined,
    };

    return {
      message: 'User registered successfully',
      data: {
        accessToken,
        user: userResponse,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<ApiResponse<AuthResponseEntity>> {
    // Find user by email
    const user = await this.authRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Generate token
    const accessToken = this.generateToken(user.id, user.email);

    const userResponse: UserResponseEntity = {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name || undefined,
    };

    return {
      message: 'Login successful',
      data: {
        accessToken,
        user: userResponse,
      },
    };
  }

  async validateUser(userId: number): Promise<UserResponseEntity | null> {
    const user = await this.authRepository.findById(userId);

    if (!user || !user.isActive) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name || undefined,
    };
  }

  private generateToken(userId: number, email: string): string {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }
}
