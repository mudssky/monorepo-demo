import { Inject, Injectable } from '@nestjs/common'
import { createTransport, Transporter } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { MODULE_OPTIONS_TOKEN, OPTIONS_TYPE } from './cofig.module-definition'
@Injectable()
export class EmailService {
  transporter: Transporter

  constructor(@Inject(MODULE_OPTIONS_TOKEN) options: typeof OPTIONS_TYPE) {
    this.transporter = createTransport(options.smtpOptions)
    // this.transporter = createTransport({
    //   host: 'smtp.qq.com',
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: '你的邮箱地址',
    //     pass: '你的授权码',
    //   },
    // })
  }

  async sendMail(options: Mail.Options) {
    await this.transporter.sendMail(options)
  }
}
