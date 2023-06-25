import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
var nodemailer = require('nodemailer');
@Injectable()
export class EmailService {
  transporter: any;
  constructor(confing: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: confing.get('USER'),
        pass: confing.get('PASSWORD'),
      },
    });
  }

  sendEmail(message) {
    let mailOptions = {
      from: 'youremail@gmail.com',
      to: 'myfriend@yahoo.com',
      subject: 'Currency exchange above boundaries',
      text: message,
    };

    this.transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}
