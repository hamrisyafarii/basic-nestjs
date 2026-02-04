import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') ?? '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') ?? '',
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') ?? '',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { id, name, emails, photos } = profile;

    if (!emails || emails.length === 0) {
      return done(new Error('No email found from Google'), undefined);
    }

    const user = {
      googleId: id,
      email: emails[0].value,
      name: name
        ? `${name.givenName ?? ''} ${name.familyName ?? ''}`.trim()
        : undefined,
      avatar: photos && photos.length > 0 ? photos[0].value : undefined,
      provider: 'google' as const,
    };

    try {
      // Find or create user
      const registeredUser = await this.authService.validateOAuthUser(user);
      done(null, registeredUser);
    } catch (error) {
      done(error as Error, undefined);
    }
  }
}
