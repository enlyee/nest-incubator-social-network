import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RefreshTokenGuard } from '../../../common/guards/jwt.auth.guard';
import { Request } from 'express';
import { SessionService } from '../application/session.service';
import { JwtRefreshOutput } from '../../../common/strategies/jwt.strategy';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(RefreshTokenGuard)
@Controller('security')
export class SecurityController {
  constructor(private readonly sessionService: SessionService) {}
  @Get('devices')
  @HttpCode(200)
  async getSessions(@Req() req: Request) {
    const user = req.user as JwtRefreshOutput;
    return this.sessionService.getAll(user.userId);
  }

  @HttpCode(204)
  @Delete('devices')
  async deleteAllSessions /* exclude this */(@Req() req: Request) {
    const user = req.user as JwtRefreshOutput;
    await this.sessionService.deleteAllExceptOne(user.userId, user.deviceId);
    return;
  }

  @HttpCode(204)
  @Delete('devices/:id')
  async deleteOneSession(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as JwtRefreshOutput;
    const status = await this.sessionService.deleteById(id, user.userId);
    if (status === -1) throw new NotFoundException();
    if (status === 0) throw new ForbiddenException();
    return;
  }
}
