import { add } from 'date-fns/add';

export class EmailConfirmation {
  id: string;
  expiredIn: Date;
  email: string;

  constructor(email: string) {
    this.id = crypto.randomUUID();
    this.expiredIn = add(new Date(), { minutes: 10 });
    this.email = email;
  }
}
