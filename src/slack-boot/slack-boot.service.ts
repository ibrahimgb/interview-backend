import { Injectable } from '@nestjs/common';
const axios = require('axios');
const { App } = require('@slack/bolt');

import { ConfigService } from '@nestjs/config';
@Injectable()
export class SlackBootService {
  app: any;

  constructor(confing: ConfigService) {
    const signingSecret = confing.get('SLACK_SIGNING_SECRET');
    const botToken = confing.get('BOOT_TOKEN');

    this.app = new App({
      signingSecret: signingSecret,
      token: botToken,
    });
  }

  async SendSlackMessage(message: string) {
    await this.app.start(process.env.PORT || 12000);

    this.app.message('quote', async ({ say }) => {
      await say(`Hello, ${message}`);
    });

    console.log(`⚡️ Bolt app is running!`);
  }
}
