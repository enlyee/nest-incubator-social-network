import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserCreateModel } from './models/input/users.input.model';
import { UsersService } from '../application/users.service';
import { UsersQueryRepository } from '../infrastructure/users.query-repository';
import { UsersQueryFixedModel } from './models/input/users.query.input.model';
import { UsersQueryPipe } from '../../../common/pipes/users.query.pipe';
import { BasicAdminGuard } from '../../../common/guards/basic.auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('sa/users')
@UseGuards(BasicAdminGuard)
export class UsersController {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}
  @Get()
  async getUsers(@Query(UsersQueryPipe) query: UsersQueryFixedModel) {
    const result = await this.usersQueryRepository.getAll(query);
    return result;
  }

  @Post()
  async create(@Body() createModel: UserCreateModel) {
    const userOutput = await this.usersService.createUser(createModel);
    return userOutput;
  }

  @HttpCode(204)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const status: boolean = await this.usersService.deleteUser(id);
    if (!status) throw new NotFoundException();
  }
}
