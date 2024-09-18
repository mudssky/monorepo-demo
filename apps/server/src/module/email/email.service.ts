import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { createTransport, Transporter } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { MODULE_OPTIONS_TOKEN, OPTIONS_TYPE } from './cofig.module-definition'
@Injectable()
export class EmailService implements OnModuleInit {
  transporter: Transporter
  @Inject(MODULE_OPTIONS_TOKEN)
  private options: typeof OPTIONS_TYPE
  constructor() {
    // console.log('dasdsa', this.options)
    // this.transporter = createTransport(this.options.smtpOptions)
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
  //   属性注入的时机在构造函数之后，所以这里把邮件的初始化后挪了
  onModuleInit() {
    this.transporter = createTransport(this.options.smtpOptions)
  }

  async sendMail(options: Mail.Options) {
    await this.transporter.sendMail(options)
  }
  getConfig() {
    return this.options.smtpOptions
  }
}
