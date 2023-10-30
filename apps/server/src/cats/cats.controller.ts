import { Controller, Get, Req } from '@nestjs/common'
import { Request } from 'express'
import { pick } from 'lodash'

@Controller('cats')
export class CatsController {
  @Get()
  findAll(@Req() req: Request) {
    console.log({
      ...pick(req, ['body', 'query']),
    })
    return 'This action returns all cats'
  }
}
