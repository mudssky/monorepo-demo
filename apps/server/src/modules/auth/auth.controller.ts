import { ApiCustomResponse } from '@/common/decorators/swagger'
import { BaseException } from '@/common/exceptions'
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { GlobalLoggerService } from '../logger/logger.service'
import { CreateUserDto } from '../user/dto/user.dto'
import { Public } from './auth.decorator'
import { AuthService } from './auth.service'
import {
  GithubCallbackDto,
  LoginDto,
  LoginResDto,
  RegisterResDto,
} from './dto/auth.dto'
import { GithubAuthGuard, GoogleAuthGuard } from './guards'
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

  /**
   *
   * 两个方法，githubLogin仅用于重定向授权页面，
   * githubCallback url可以给前端用，会在query参数里加上code，此时前端可以通过get方法，拿到授权。
   * 如果给后端用，等于get方法加code，可以直接通过code获取到profile。
   *
   * 在develop setting ->OAuth Apps 配置
   */
  @Public()
  @ApiOperation({ summary: 'github登录授权触发地址' })
  @Get('githubLogin')
  @UseGuards(GithubAuthGuard)
  async githubLogin() {
    // this.loggerService.debug({ user: req.user })
    // 这里不会执行到，这里会直接执行重定向授权页面，没有别的效果
  }

  @Public()
  @ApiOperation({ summary: '使用github的code进行登录' })
  @ApiQuery({ type: GithubCallbackDto })
  @ApiCustomResponse({
    type: LoginResDto,
  })
  @Get('githubLoginCallback')
  @UseGuards(GithubAuthGuard)
  async githubLoginCallback(@Req() req) {
    return this.authService.githubLogin(req.user)
  }

  @Public()
  @ApiOperation({ summary: 'google登录授权触发地址' })
  @Get('googleLogin')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {}

  @Public()
  @ApiOperation({ summary: '使用google的code进行登录' })
  @ApiQuery({ type: GithubCallbackDto })
  @ApiCustomResponse({
    type: LoginResDto,
  })
  @Get('googleLoginCallback')
  @UseGuards(GoogleAuthGuard)
  async googleLoginCallback(@Req() req) {
    if (!req.user) {
      throw new BaseException('google登录失败')
    }
    return this.authService.googleLogin(req.user)
  }
}
