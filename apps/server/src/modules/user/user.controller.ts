import { Body, Controller, Get, Post, Request } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import type { User as UserModel } from '@prisma/client'

import { ApiCustomResponse } from '@/common/decorators/swagger'
import { CreateUserDto, UserDto } from './dto/user.dto'
import { UserService } from './user.service'

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  async signupUser(@Body() userData: CreateUserDto): Promise<UserModel> {
    return this.userService.createUser(userData)
  }
  @Get('user')
  async getUser() {
    return this.userService.users({})
  }

  @Get('users')
  async getUsers() {
    return this.userService.users({
      take: 10,
    })
  }

  @ApiOperation({ summary: '获取当前登录用户信息' })
  @ApiCustomResponse({
    model: UserDto,
  })
  @Get('userInfo')
  async login(@Request() req) {
    const userInfo = this.userService.getUserInfo(req.user)

    return userInfo
  }
}
