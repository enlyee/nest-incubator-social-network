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
    await this.connection.query(`DELETE FROM public."email_confirmation"`);
    await this.connection.query(`DELETE FROM public."session"`);
    await this.connection.query(`DELETE FROM public."comment_like"`);
    await this.connection.query(`DELETE FROM public."post_like"`);
    await this.connection.query(`DELETE FROM public."comment"`);
    await this.connection.query(`DELETE FROM public."post"`);
    await this.connection.query(`DELETE FROM public."user"`);
    await this.connection.query(`DELETE FROM public."blog"`);
  }
}
