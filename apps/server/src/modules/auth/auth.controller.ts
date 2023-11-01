import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common'
import { CreateUserDto } from '../user/dto/user.dto'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { AuthGuard } from '@nestjs/passport'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto)
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    // return this.authService.login(loginDto)
    // console.log({ loginDto })
    return req.user
  }
}
