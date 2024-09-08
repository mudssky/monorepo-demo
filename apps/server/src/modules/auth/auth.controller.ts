import { ApiCustomResponse } from '@/common/decorators/swagger'
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { GlobalLoggerService } from '../logger/logger.service'
import { CreateUserDto } from '../user/dto/user.dto'
import { Public } from './auth.decorator'
import { AuthService } from './auth.service'
import { LoginDto, LoginResDto, RegisterResDto } from './dto/auth.dto'
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private loggerService: GlobalLoggerService,
  ) {
    this.loggerService.setContext({ label: AuthController.name })
  }
  /**
   * 注册和登录接口需要公开
   * @param createUserDto
   * @returns
   */
  @Public()
  @ApiOperation({ summary: '用户注册' })
  @ApiCustomResponse({ type: RegisterResDto })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto)
  }

  @Public()
  @ApiOperation({ summary: '用户登录' })
  @ApiBody({ type: LoginDto })
  @ApiCustomResponse({
    type: LoginResDto,
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user)
  }

  @Get('githubLogin')
  @UseGuards(AuthGuard('github'))
  async githubLogin(@Req() req) {
    this.loggerService.log({ req })
  }
}
