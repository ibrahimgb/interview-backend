import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
const axios = require('axios');

const { WebClient } = require('@slack/web-api');

@Injectable()
export class CurrencyExchangeService {
  constructor() {}

  token = 'YOUR_SLACK_API_TOKEN';
  web = new WebClient(this.token);

  currencyList = ['EUR', 'GBP'];
  minWarningRate = 3; //%
  maxWarningRate = -3; //%
  currentExchangeRate = {
    EUR: 0.95,
    GBP: 0.9,
  };

  currencyMinRef = { USD: 1, EUR: 0.85, GBP: 0.75 };
  currencyMaxRef = { USD: 1, EUR: 0.93, GBP: 0.85 };
  currencyCurrentRef = { USD: 1, EUR: 0.95, GBP: 0.88 };

  async getExchangeRate(): Promise<Object> {
    try {
      const response = await axios.get(
        'https://api.exchangerate-api.com/v4/latest/USD',
      );
      const rates = response.data.rates;
      const currencyExchange = {
        USD: 1,
        ...this.currencyList.reduce((exchange, currency) => {
          exchange[currency] = rates[currency];
          return exchange;
        }, {}),
      };
      //console.log(currencyExchange);
      return currencyExchange;
    } catch (error) {
      console.error('Error fetching exchange rate:', error.message);
      throw error;
    }
  }

  checkIfProblem() {
    this.getExchangeRate().then((res) => {
      console.log(res);
      for (const currency in res) {
        if (res.hasOwnProperty(currency)) {
          const value = res[currency];
          const refValue = this.currencyMinRef[currency];

          if (value < refValue) {
            this.triggerErrer(currency, value, refValue);
          }
        }
      }
      for (const currency in res) {
        if (res.hasOwnProperty(currency)) {
          const value = res[currency];
          const refValue = this.currencyMaxRef[currency];

          if (value > refValue) {
            this.triggerErrer(currency, value, refValue);
          }
        }
      }
    });
  }

  triggerErrer(currency: string, value: number, refValue: number) {
    let errer = '';
    if (value > refValue)
      errer = `${currency} value (${value}) is below the currency reference (${refValue}).`;
    //this.sendSlackMessage('CHANNEL_ID', errer);
    //   console.error(
    //     `${currency} value (${value}) is below the currency reference (${refValue}).`,
    //   );

    if (value < refValue)
      errer = `${currency} value (${value}) is above the currency reference (${refValue}).`;
    //this.sendSlackMessage('CHANNEL_ID', errer);
    console.error(
      `${currency} value (${value}) is above the currency reference (${refValue}).`,
    );
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

  @Cron('* * * * * *')
  currencyUpdate() {
    //console.log('Running my function every 1 min.');
    this.checkIfProblem();
  }
}
