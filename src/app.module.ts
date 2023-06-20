import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CurrencyExchangeModule } from './currency-exchange/currency-exchange.module';
import { EmailService } from './email/email.service';

@Module({
  imports: [ScheduleModule.forRoot(), CurrencyExchangeModule],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}
