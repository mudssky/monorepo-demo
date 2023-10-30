import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  Param,
  Post,
  Query,
  Redirect,
  Req,
} from '@nestjs/common'
import { ApiProperty, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { pick } from 'lodash'

export class CreateCatDto {
  @ApiProperty({
    description: '名字',
  })
  name: string
  @ApiProperty()
  age: number
  @ApiProperty()
  breed: string
}

@Controller('cats')
@ApiTags('cats')
export class CatsController {
  @Get()
  findAll(@Req() req: Request) {
    console.log({
      ...pick(req, ['body', 'query']),
    })
    return 'This action returns all cats'
  }
  @Post()
  @HttpCode(204)
  @Header('Cache-Control', 'none')
  async create(@Body() createCatDto: CreateCatDto) {
    console.log({ createCatDto })
    return 'This action adds a new cat'
  }

  /**
   * 支持路由通配符，只有express中间件支持
   * @returns
   */
  @Get('ab*cd')
  findAllWildCard() {
    return 'This route uses a wildcard'
  }

  // 重定向
  // 返回值将覆盖传递给 @Redirect() 装饰器的任何参数
  // http://localhost:33101/cats/docs?version=5
  @Get('docs')
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Query('version') version) {
    if (version && version === '5') {
      return { url: 'https://docs.nestjs.com/v5/' }
    }
  }

  @Get(':id')
  findOne(@Param() params: any): string {
    console.log(params.id)
    return `This action returns a #${params.id} cat`
  }
}

// 子域路由，要求传入请求的 HTTP 主机与某个特定值匹配，可以针对不同的主机匹配不同的控制器
// fastify不支持
// @Controller({ host: 'admin.example.com' })
// export class AdminController {
//   @Get()
//   index(): string {
//     return 'Admin page';
//   }
// }
// @Controller({ host: ':account.example.com' })
// export class AccountController {
//   @Get()
//   getInfo(@HostParam('account') account: string) {
//     return account;
//   }
// }
