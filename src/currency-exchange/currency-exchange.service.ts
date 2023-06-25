import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
const axios = require('axios');
const fs = require('fs');
const { WebClient } = require('@slack/web-api');
@Injectable()
export class CurrencyExchangeService {
  constructor(private database: PrismaService) {}

  currentExchangeRate;
  myExchangeRate;

  async getMyExchangeRate() {
    let res = await this.database.currency.findMany();

    const transformedData = res.map((currency) => {
      return {
        ...res[0],
        currentExchangeRate: this.currentExchangeRate[currency.currency],
      };
    });

    this.myExchangeRate = transformedData;

    return transformedData;
  }

  async getExchangeRate(): Promise<Object> {
    const filter_list = await this.database.currency.findMany({
      select: {
        currency: true,
        storeExchangeRate: false,
        minExchangeRate: false,
        maxExchangeRate: false,
      },
    });

    console.log(filter_list);

    function getReducedList(res, filter_list) {
      return Object.keys(res)
        .filter((key) => filter_list.some((obj) => obj.currency === key))
        .reduce((acc, key) => {
          acc[key] = res[key];
          return acc;
        }, {});
    }

    try {
      const response = await axios.get(
        'https://api.exchangerate-api.com/v4/latest/EUR',
      );
      const rates = response.data.rates;
      const currencyExchange = getReducedList(rates, filter_list);

      //console.log(currencyExchange);
      this.currentExchangeRate = currencyExchange;
      return currencyExchange;
    } catch (error) {
      console.error('Error fetching exchange rate:', error.message);
      throw error;
    }
  }

  getByCurrency(list, key) {
    list.filter((item) => {
      item.currency = key;
    });
  }

  checkIfProblem() {
    this.getExchangeRate().then((res) => {
      console.log(res);
    });
  }

  triggerErrer(currency: string, value: number, refValue: number, isAbove) {
    let errer = '';
    if (isAbove)
      errer = `${currency} value (${value}) is below the currency reference (${refValue}).`;
    //this.sendSlackMessage('CHANNEL_ID', errer);
    //   console.error(
    //     `${currency} value (${value}) is below the currency reference (${refValue}).`,
    //   );

    if (isAbove)
      errer = `${currency} value (${value}) is above the currency reference (${refValue}).`;
    //this.sendSlackMessage('CHANNEL_ID', errer);
  }

  async sendSlackMessage(channel, text) {
    try {
      const result = await WebClient.chat.postMessage({
        channel: channel,
        text: text,
      });
      console.log('Message sent:', result.ts);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  editCurrency(obj) {
    this.database.currency.update({
      where: {
        currency: obj.currency,
      },
      data: {
        minExchangeRate: obj.currencyMinRef,
        maxExchangeRate: obj.currencyMaxRef,
        storeExchangeRate: obj.currencyStoreRef,
      },
    });
  }

  @Cron('* * * * * *')
  currencyUpdate() {
    //console.log('Running my function every 1 min.');
    this.checkIfProblem();
  }
}
