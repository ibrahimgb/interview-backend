import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class PrismaService extends PrismaClient {
  constructor(confing: ConfigService) {
    super({
      datasources: {
        db: {
          url: confing.get('DATABASE_URL'),
        },
      },
    });
  }

  async createUser() {
    const user = this.currency.create({
      data: {
        currency: 'USD',
        storeExchangeRate: 1.2,
        minExchangeRate: 0.2,
        maxExchangeRate: 0.4,
      },
    });
    console.log(user);
  }

  cleanDb() {
    //this.$transaction([])
    this.currency.deleteMany().then(() => {
      this.$disconnect();
    });
    return;
  }
}
