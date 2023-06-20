import { Controller, Get } from '@nestjs/common';
import { CurrencyExchangeService } from './currency-exchange.service';
@Controller('currency-exchange')
export class CurrencyExchangeController {
  constructor(
    private readonly currencyExchangeService: CurrencyExchangeService,
  ) {
    // this.currencyExchangeService.currencyUpdate();
  }
  @Get()
  getHello() {
    return this.currencyExchangeService.getExchangeRate();
  }
}
