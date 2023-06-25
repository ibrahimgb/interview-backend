import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CurrencyExchangeModule } from './currency-exchange/currency-exchange.module';
import { EmailService } from './email/email.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { SlackBootService } from './slack-boot/slack-boot.service';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    CurrencyExchangeModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService, PrismaService, SlackBootService],
})
export class AppModule {}
