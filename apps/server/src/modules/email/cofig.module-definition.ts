import { ConfigurableModuleBuilder } from '@nestjs/common'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

export interface ConfigModuleOptions {
  smtpOptions?: SMTPTransport.Options
  // isGlobal?: boolean
}

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  ASYNC_OPTIONS_TYPE,
  OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<ConfigModuleOptions>()
  .setExtras(
    {
      isGlobal: true,
    },
    (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    }),
  )
  .setClassMethodName('forRoot')
  .build()
