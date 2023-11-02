import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common'
import { CreateUserDto } from '../user/dto/user.dto'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard'
import { Public } from './auth.decorator'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  /**
   * 注册和登录接口需要公开
   * @param createUserDto
   * @returns
   */
  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto)
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user)
  }
}
