import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { User } from '../../users/domain/users.entity';
import { jwtConstants } from '../constants';
import { LoginAuthModel } from '../api/models/input/login.auth.model';
import { RegistrationAuthModel } from '../api/models/input/registration.auth.model';
import { UsersService } from '../../users/application/users.service';
import { MailService } from '../../../common/mailer/api/mailer';
import * as bcrypt from 'bcryptjs';
import { EmailConfirmation } from '../domain/email.confirmation.entity';
import { EmailConfirmationRepository } from '../infrastructure/email.confirmation.repository';
import { JwtRefreshOutput } from '../../../common/strategies/jwt.strategy';
import { SessionService } from '../../security/application/session.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly emailConfirmationRepository: EmailConfirmationRepository,
    private readonly sessionService: SessionService,
    private readonly configService: ConfigService,
  ) {}

  //uc
  async register(userData: RegistrationAuthModel) {
    await this.usersService.createUser(userData);
    const confirmation = new EmailConfirmation(userData.email);
    await this.emailConfirmationRepository.createConfirmation(confirmation);
    await this.mailService.sendUserConfirmation(
      userData.email,
      confirmation.id,
    );
  }

  //uc
  async login(loginData: LoginAuthModel, deviceTitle: string, ip: string) {
    const user: User | null =
      await this.usersRepository.getAllUserDataByLoginOrEmail(
        loginData.loginOrEmail,
      );
    if (!user) return null;
    const hashCompare = await this._compareHashes(
      loginData.password,
      user.passwordHash,
    );
    const deviceId: string = crypto.randomUUID();
    if (!hashCompare) return null;
    const tokens = await this._getTokens(user.id, deviceId);
    const date = this._getTokenIssuing(tokens.refreshToken);
    //создание сессии
    await this.sessionService.create(user.id, deviceTitle, date, ip, deviceId);
    return tokens;
  }

  //uc but i fuck cqrs
  async logout(user: JwtRefreshOutput) {
    return this.sessionService.deleteById(user.deviceId, user.userId);
  }
  async resendEmail(email: string) {
    const confirmation = new EmailConfirmation(email);
    const status =
      await this.emailConfirmationRepository.recreateConfirmationByEmail(
        confirmation,
      );
    if (!status) return null;
    await this.mailService.sendUserConfirmation(email, confirmation.id);
  }
  async confirmUser(code: string) {
    const conf: EmailConfirmation | null =
      await this.emailConfirmationRepository.getAndDeleteConfirmation(code);
    if (!conf) return null;
    await this.usersRepository.confirmUser(conf.email);
  }
  async updateRefreshToken(user: JwtRefreshOutput) {
    const newTokens = await this._getTokens(user.userId, user.deviceId);

    const newTokenIssuing = this._getTokenIssuing(newTokens.refreshToken);
    const status = await this.sessionService.update(
      user.deviceId,
      newTokenIssuing,
    );
    if (!status) return false;
    return newTokens;
  }
  private async _compareHashes(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
  private async _getTokens(userId: string, deviceId: string) {
    const accessToken = this.jwtService.sign(
      { userId: userId },
      {
        secret: jwtConstants.secret,
        expiresIn: `${this.configService.get('jwtTime.access')}s`,
      },
    );
    const refreshToken = this.jwtService.sign(
      {
        userId: userId,
        deviceId: deviceId,
      },
      {
        secret: jwtConstants.secret,
        expiresIn: `${this.configService.get('jwtTime.refresh')}s`,
      },
    );
    return { refreshToken: refreshToken, accessToken: accessToken };
  }
  private _getTokenIssuing(token: string) {
    try {
      const iat = this.jwtService.decode(token, { complete: true }).payload.iat;
      const iatDate = new Date(iat * 1000);
      return iatDate;
    } catch (error) {
      return null;
    }
  }
}
