import { Module } from '@nestjs/common';
import { CurrencyExchangeService } from './currency-exchange.service';
import { CurrencyExchangeController } from './currency-exchange.controller';

@Module({
  providers: [CurrencyExchangeService],
  controllers: [CurrencyExchangeController]
})
export class CurrencyExchangeModule {}
