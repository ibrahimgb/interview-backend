import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
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
  @Get('currency')
  getCurrency() {
    return this.currencyExchangeService.getMyExchangeRate();
  }

  @Post()
  editCurrences(@Body() obj: any) {
    console.log(obj);
    return this.currencyExchangeService.editCurrency(obj);
  }

  @Delete()
  deleteCurrency(@Query('currency') currency) {
    console.log(currency);
    return currency;
  }
}
