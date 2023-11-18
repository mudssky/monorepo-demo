import { Controller, Get } from '@nestjs/common'
import { ApiExtraModels } from '@nestjs/swagger'
import { AppService } from './app.service'
import { CustomResponseDto } from './common/dto/response.dto'

// swagger使用的额外模型，在其他定义也不太合适，所以放到app controller
@ApiExtraModels(CustomResponseDto)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
}
