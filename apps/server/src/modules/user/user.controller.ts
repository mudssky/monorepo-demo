import { Body, Controller, Get, Post } from '@nestjs/common'
import { UserService } from './user.service'
import type { User as UserModel } from '@prisma/client'

import { ApiTags } from '@nestjs/swagger'
import { User } from './dto/user.dto'

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  async signupUser(@Body() userData: User): Promise<UserModel> {
    return this.userService.createUser(userData)
  }
  @Get('user')
  async getUser() {
    return this.userService.users({})
  }
}