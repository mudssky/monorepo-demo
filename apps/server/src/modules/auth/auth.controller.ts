import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common'
import { CreateUserDto } from '../user/dto/user.dto'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from '@/common/guards/local-auth/local-auth.guard'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto)
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user)
  }
}
