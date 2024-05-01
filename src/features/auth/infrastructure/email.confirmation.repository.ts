import { Injectable } from '@nestjs/common';
import { EmailConfirmation } from '../domain/email.confirmation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EmailConfirmationRepository {
  constructor(
    @InjectRepository(EmailConfirmation)
    private connection: Repository<EmailConfirmation>,
  ) {}
  async createConfirmation(confirmation: EmailConfirmation) {
    await this.connection.save(confirmation);
  }

  async findConfirmation(code: string) {
    try {
      const confirm = await this.connection
        .findOneBy({ id: code })
        .catch((err: any) => {
          throw Error;
        });
      return confirm;
    } catch (err) {
      return null;
    }
  }

  async getAndDeleteConfirmationByCode(code: string) {
    try {
      const deleteResult = await this.connection
        .createQueryBuilder()
        .delete()
        .from(EmailConfirmation)
        .where('id = :id', { id: code })
        .returning('email')
        .execute();
      return deleteResult.raw[0].email;
    } catch (err) {
      return null;
    }
  }

  async getAndDeleteConfirmationByEmail(email: string) {
    try {
      const deleteResult = await this.connection
        .createQueryBuilder()
        .delete()
        .from(EmailConfirmation)
        .where('email = :email', { email: email })
        .returning('userId')
        .execute();
      console.log(deleteResult);
      return deleteResult.raw[0].userId;
    } catch (err) {
      return null;
    }
  }
}
