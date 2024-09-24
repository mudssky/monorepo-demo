import { ApiCustomResponse } from '@/common/decorators/swagger'
import { BaseException } from '@/common/exceptions'
import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { CreateUserDto } from '../user/dto/user.dto'
import { Public, UserInfo } from './auth.decorator'
import { AuthService } from './auth.service'
import {
  ChangePasswordDto,
  ForgetPasswordDto,
  GithubCallbackDto,
  LoginDto,
  LoginResDto,
  RegisterResDto,
  SendCaptchaDto,
} from './dto/auth.dto'
import { GithubAuthGuard, GoogleAuthGuard } from './guards'
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard'
import { JwtPayload } from './types'

// TODO: refreshtoken的内容，这边还没写。因为不影响功能，所以留到后面写吧
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name)
  constructor(private authService: AuthService) {}
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
  @ApiOperation({ summary: '发送注册验证码' })
  @ApiCustomResponse({ type: Boolean })
  @Post('sendRegisterCaptcha')
  async sendRegisterCaptcha(@Body() sendCaptchaDto: SendCaptchaDto) {
    return this.authService.sendCaptcha(sendCaptchaDto, {
      captchaType: 'register',
    })
  }

  @ApiOperation({ summary: '发送修改密码验证码' })
  @ApiCustomResponse({ type: Boolean })
  @Post('sendChangePasswordCaptcha')
  async sendChangePasswordCaptcha(@Body() sendCaptchaDto: SendCaptchaDto) {
    return this.authService.sendCaptcha(sendCaptchaDto, {
      captchaType: 'changePassword',
    })
  }

  @ApiOperation({ summary: '发送忘记密码验证码' })
  @ApiCustomResponse({ type: Boolean })
  @Post('sendForgetPasswordCaptcha')
  async sendForgetPasswordCaptcha(@Body() sendCaptchaDto: SendCaptchaDto) {
    return this.authService.sendCaptcha(sendCaptchaDto, {
      captchaType: 'forgetPassword',
    })
  }

  /**
   * 这里LocalAuthGuard中使用local strategy完成了认证,所以这里req上面的user就是user表的信息。
   * @param userInfo
   * @returns
   */
  @Public()
  @ApiOperation({ summary: '用户登录' })
  @ApiBody({ type: LoginDto })
  @ApiCustomResponse({
    type: LoginResDto,
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@UserInfo() userInfo: User) {
    return this.authService.addToken(userInfo)
  }

  @ApiOperation({ summary: '修改密码' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiCustomResponse({
    type: Boolean,
  })
  @Post('changePassword')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @UserInfo() userInfo: JwtPayload,
  ) {
    return this.authService.changePassword(changePasswordDto, userInfo)
  }

  @Public()
  @ApiOperation({ summary: '忘记密码' })
  @ApiBody({ type: ForgetPasswordDto })
  @ApiCustomResponse({
    type: Boolean,
  })
  @Post('forgetPassword')
  async forgetPassword(@Body() changePasswordDto: ForgetPasswordDto) {
    return this.authService.forgetPassword(changePasswordDto)
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
  async googleLoginCallback(@UserInfo() userInfo: JwtPayload) {
    if (userInfo) {
      throw new BaseException('google登录失败')
    }
    return this.authService.googleLogin(userInfo)
  }
}
