import { Body, Controller, Post } from '@nestjs/common'
import { CreateUserDto } from '../user/dto/user.dto'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    // console.log({ createUserDto })
    // const res = await this.authService.register(createUserDto)
    // console.log({ res })

    return this.authService.register(createUserDto)
  }
}
