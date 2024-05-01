import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from '../../features/security/application/session.service';
import { ConfigService } from '@nestjs/config';

export class JwtAccessOutput {
  userId: string;
}
export class JwtRefreshOutput {
  userId: string;
  deviceId: string;
  refreshToken: string;
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  configService: ConfigService;
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('jwtConfig.secret'),
    });
  }

  async validate(payload: {
    userId: string;
    exp: any;
  }): Promise<JwtAccessOutput> {
    console.log(payload.exp);
    return { userId: payload.userId };
  }
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  configService: ConfigService;
  constructor(
    configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJWT,
      ]),
      secretOrKey: configService.get('jwtConfig.secret'),
      passReqToCallback: true,
    });
  }

  private static extractJWT(req: Request): string | null {
    if (
      req.cookies &&
      'refreshToken' in req.cookies &&
      req.cookies.refreshToken.length > 0
    ) {
      return req.cookies.refreshToken;
    }
    return null;
  }

  async validate(req: Request, payload: { userId: string; deviceId: string }) {
    const refreshToken = req.cookies['refreshToken'];
    const iat = this.jwtService.decode(refreshToken, { complete: true }).payload
      .iat;
    const date = new Date(iat * 1000);
    const tokenStatus = await this.sessionService._checkTokenActuality(
      payload.deviceId,
      date,
    );
    if (!tokenStatus) return false;
    return {
      userId: payload.userId,
      deviceId: payload.deviceId,
      refreshToken: refreshToken!,
    };
  }
}
