import { Injectable } from '@nestjs/common';
import { User } from 'src/generated/prisma/client';
import { DatabaseService } from 'src/infrastructure/database/database.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.databaseService.user.findUnique({
      where: { email },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.databaseService.user.findUnique({
      where: { username },
    });
  }

  async findById(id: number): Promise<User | null> {
    return await this.databaseService.user.findUnique({
      where: { id },
    });
  }

  async create(data: RegisterDto & { password: string }) {
    return await this.databaseService.user.create({
      data,
    });
  }

  async updatePassword(id: number, hasHadPassword: string) {
    return await this.databaseService.user.update({
      where: {
        id,
      },
      data: {
        password: hasHadPassword,
      },
    });
  }

  // find Google ID
  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.databaseService.user.findUnique({
      where: { googleId },
    });
  }

  async createOAuthUser(data: {
    email: string;
    name?: string;
    googleId?: string;
    avatar?: string;
    provider: string;
  }): Promise<User> {
    return this.databaseService.user.create({
      data: {
        email: data.email,
        name: data.name,
        googleId: data.googleId,
        avatar: data.avatar,
        provider: data.provider,
        emailVerified: true, // OAuth users are auto-verified
      },
    });
  }
}
