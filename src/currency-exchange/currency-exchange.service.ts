import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
const axios = require('axios');
const fs = require('fs');
const { WebClient } = require('@slack/web-api');
@Injectable()
export class CurrencyExchangeService {
  //   storage = diskStorage({
  //     destination: (req, file, cb) => {
  //       // Specify the directory where the file will be saved
  //       const directory = './uploads';
  //       cb(null, directory);
  //     },
  //     filename: (req, file, cb) => {
  //       // Set a custom file name
  //       cb(null, 'data.json');
  //     },
  //  });
  constructor() {
    // const readJsonFile = (req, res) => {
    //   try {
    //     const filePath = './data/data.json';
    //     const jsonData = fs.readFileSync(filePath, 'utf-8');
    //     const parsedData = JSON.parse(jsonData);
    //     res.json(parsedData);
    //   } catch (error) {
    //     console.error('Error reading JSON file:', error);
    //     res.status(500).json({ error: 'Failed to read JSON file.' });
    //   }
    // };
    // console.log(readJsonFile);
  }

  token = 'SLACK_API_TOKEN';
  web = new WebClient(this.token);

  currencyList = ['USD', 'GBP'];
  currencyMinRef = { USD: 0.05, GBP: 0.05 };
  currencyMaxRef = { USD: 0.1, GBP: 0.1 };
  currencyStoreRef = { USD: 1, GBP: 0.88 };
  currentExchangeRate = { USD: 1.09, GBP: 0.853 };

  async getMyExchangeRate() {
    const transformedData = this.currencyList.map((currency) => {
      return {
        currency: currency,
        storeExchangeRate: this.currencyStoreRef[currency],
        minExchangeRate: this.currencyMinRef[currency],
        maxExchangeRate: this.currencyMaxRef[currency],
        currentExchangeRate: this.currentExchangeRate[currency],
      };
    });

    return transformedData;
  }

  async getExchangeRate(): Promise<Object> {
    try {
      const response = await axios.get(
        'https://api.exchangerate-api.com/v4/latest/EUR',
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

          if (value < refValue - this.currencyStoreRef[currency]) {
            this.triggerErrer(currency, value, refValue, false);
          }
        }
      }
      for (const currency in res) {
        if (res.hasOwnProperty(currency)) {
          const value = res[currency];
          const refValue = this.currencyMaxRef[currency];

          if (value > refValue + this.currencyStoreRef[currency]) {
            this.triggerErrer(currency, value, refValue, true);
          }
        }
      }
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
    this.currencyMinRef[obj.currency] = obj.currencyMinRef;
    this.currencyMaxRef[obj.currency] = obj.currencyMaxRef;
    this.currencyStoreRef[obj.currency] = obj.currencyStoreRef;
  }

  @Cron('* * * * * *')
  currencyUpdate() {
    //console.log('Running my function every 1 min.');
    this.checkIfProblem();
  }
}
