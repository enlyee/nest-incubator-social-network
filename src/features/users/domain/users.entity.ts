export class User {
  id: string;
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  isConfirmed: boolean;

  constructor(login: string, email: string, passwordHash: string) {
    this.id = crypto.randomUUID();
    this.login = login;
    this.email = email;
    this.passwordHash = passwordHash;
    this.createdAt = new Date();
    this.isConfirmed = false;
  }
}
