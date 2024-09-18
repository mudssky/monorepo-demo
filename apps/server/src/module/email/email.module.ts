import { Module } from '@nestjs/common'
import { ConfigurableModuleClass } from './cofig.module-definition'
import { EmailService } from './email.service'
@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule extends ConfigurableModuleClass {}
