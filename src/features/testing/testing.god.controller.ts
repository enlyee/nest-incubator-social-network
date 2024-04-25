import { Controller, Delete, HttpCode } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@SkipThrottle()
@Controller('testing/all-data')
export class TestingGodController {
  constructor(@InjectDataSource() private connection: DataSource) {}

  @HttpCode(204)
  @Delete()
  async dropDB() {
    await this.connection.query(`DELETE FROM public."emailConfirmation"`);
    await this.connection.query(`DELETE FROM public."sessions"`);
    await this.connection.query(`DELETE FROM public."commentsLikes"`);
    await this.connection.query(`DELETE FROM public."comments"`);
    await this.connection.query(`DELETE FROM public."postsLikes"`);
    await this.connection.query(`DELETE FROM public."posts"`);
    await this.connection.query(`DELETE FROM public."users"`);
    await this.connection.query(`DELETE FROM public."blogs"`);
  }
}
