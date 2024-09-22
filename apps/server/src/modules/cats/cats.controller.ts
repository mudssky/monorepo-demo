import { ZodValidationPipe } from '@/common/pipes/zod-validation/zod-validation.pipe'
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Redirect,
  UsePipes,
} from '@nestjs/common'
import { ApiProperty, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { CatsService } from './cats.service'
import { Cat } from './interfaces/cat.interface'

export const createCatSchema = z
  .object({
    name: z.string(),
    age: z.number(),
    breed: z.string(),
  })
  .required()

// export type CreateCatDto = z.infer<typeof createCatSchema>;
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
  constructor(private catsService: CatsService) {}
  @Get()
  async findAll(): Promise<Cat[]> {
    // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
    return this.catsService.findAll()
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createCatSchema))
  async create(@Body() createCatDto: CreateCatDto) {
    console.log({ createCatDto })
    // return 'This action adds a new cat'
    this.catsService.create(createCatDto)
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
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.catsService.findOne(id)
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
