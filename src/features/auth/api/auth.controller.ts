import {
  Body,
  Controller,
  Get,
  HttpCode,
  Ip,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { LoginAuthModel } from './models/input/login.auth.model';
import { Response, Request } from 'express';
import { RegistrationAuthModel } from './models/input/registration.auth.model';
import { UsersQueryRepository } from '../../users/infrastructure/users.query-repository';
import {
  AccessTokenGuard,
  RefreshTokenGuard,
} from '../../../common/guards/jwt.auth.guard';
import {
  JwtAccessOutput,
  JwtRefreshOutput,
} from '../../../common/strategies/jwt.strategy';
import {
  CodeConfirmationModel,
  EmailResending,
} from './models/input/email.confirmation.model';
import { SkipThrottle, ThrottlerGuard } from '@nestjs/throttler';
import { JwtService } from '@nestjs/jwt';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly jwtService: JwtService,
  ) {}

  @HttpCode(200)
  @Post('login')
  async login(
    @Res({ passthrough: true }) response: Response,
    @Req() req: Request,
    @Body() loginData: LoginAuthModel,
    @Ip() ip: string,
  ) {
    const deviceTitle = req.headers['user-agent'];
    const result = await this.authService.login(loginData, deviceTitle, ip);
    if (!result) throw new UnauthorizedException();
    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return { accessToken: result.accessToken };
  }

  @HttpCode(204)
  @Post('registration')
  async registration(@Body() userData: RegistrationAuthModel) {
    await this.authService.register(userData);
  }

  @SkipThrottle()
  @Get('me')
  @UseGuards(AccessTokenGuard)
  async getInformation(@Req() req: Request) {
    const payload: JwtAccessOutput = req.user as JwtAccessOutput;
    const profile = await this.usersQueryRepository.getProfileById(
      payload.userId,
    );
    return profile;
  }

  @HttpCode(204)
  @Post('registration-confirmation')
  async registrationConfirmation(@Body() code: CodeConfirmationModel) {
    await this.authService.confirmUser(code.code);
    return;
  }

  @HttpCode(204)
  @SkipThrottle()
  @Post('logout')
  @UseGuards(RefreshTokenGuard)
  async logout(
    @Res({ passthrough: true }) response: Response,
    @Req() req: Request,
  ) {
    const user = req.user as JwtRefreshOutput;
    const status = await this.authService.logout(user);
    if (status != 1) throw new UnauthorizedException();
    response.cookie('refreshToken', '');
    return;
  }

  @HttpCode(204)
  @Post('registration-email-resending')
  async emailResending(@Body() email: EmailResending) {
    await this.authService.resendEmail(email.email);
    return;
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(200)
  @Post('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as JwtRefreshOutput;
    const result = await this.authService.updateRefreshToken(user);
    if (!result) throw new UnauthorizedException();
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return { accessToken: result.accessToken };
  }
}
