export class Blog {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;

  constructor(name: string, description: string, websiteUrl: string) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
    this.createdAt = new Date();
    this.isMembership = false;
  }
}
