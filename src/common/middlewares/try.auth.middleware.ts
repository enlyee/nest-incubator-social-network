import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtAccessOutput } from '../strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TryAuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = { userId: null };
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];

    const tokenPayload = await this.getTokenPayload(token);
    if (tokenPayload) {
      req.user = tokenPayload;
      next();
      return;
    }
    next();
  }

  private async getTokenPayload(token: string) {
    try {
      const result: any = this.jwtService.decode(token);
      return result as JwtAccessOutput;
    } catch (err) {
      return null;
    }
  }
}
