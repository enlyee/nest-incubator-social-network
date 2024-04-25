import { Injectable } from '@nestjs/common';
import { EmailConfirmation } from '../domain/email.confirmation.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class EmailConfirmationRepository {
  constructor(
    @InjectDataSource()
    private connection: DataSource,
  ) {}
  async createConfirmation(confirmation: EmailConfirmation) {
    await this.connection.query(
      `INSERT INTO public."emailConfirmation" ("id", "expiredIn", "email") VALUES ($1, $2, $3);`,
      [confirmation.id, confirmation.expiredIn, confirmation.email],
    );
  }

  async findConfirmation(code: string) {
    try {
      const confirm: EmailConfirmation[] = await this.connection.query(
        'SELECT * FROM public."emailConfirmation" c WHERE c."id" = $1',
        [code],
      );
      return confirm[0];
    } catch (err) {
      return null;
    }
  }

  async getAndDeleteConfirmation(code: string) {
    try {
      return (
        await this.connection.query(
          `DELETE
        FROM public."emailConfirmation" c
        WHERE c."id" = $1
        RETURNING *;`,
          [code],
        )
      )[0][0];
    } catch (err) {
      return null;
    }
  }

  async recreateConfirmationByEmail(confirmation: EmailConfirmation) {
    try {
      const isExist = (
        await this.connection.query(
          `DELETE FROM public."emailConfirmation" p WHERE p."email" = $1`,
          [confirmation.email],
        )
      )[1];
      if (!isExist) return null;
      await this.createConfirmation(confirmation); //todo to servciice
      return true;
    } catch (err) {
      return null;
    }
  }
}
