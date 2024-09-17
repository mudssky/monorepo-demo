import { Body, Controller, Get, Post, Put, Request } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import type { User as UserModel } from '@prisma/client'

import { ApiCustomResponse } from '@/common/decorators/swagger'
import { JwtPayload } from '../auth/types'
import { CreateUserDto, UpdateUserDto, UserDto } from './dto/user.dto'
import { UserService } from './user.service'

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  async signupUser(@Body() userData: CreateUserDto): Promise<UserModel> {
    return this.userService.createUser(userData)
  }

  @Put('user')
  @ApiOperation({ summary: '根据uid修改用户信息' })
  async getUser(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser({
      where: {
        id: updateUserDto.id,
      },
      data: {
        ...updateUserDto, // 更新用户信息
      },
    })
  }

  @Get('users')
  async getUsers() {
    return this.userService.users({
      take: 10,
    })
  }

  @ApiOperation({ summary: '获取当前登录用户信息' })
  @ApiCustomResponse({
    type: UserDto,
  })
  @Get('userInfo')
  async login(@Request() req) {
    const userInfo = await this.userService.getUserInfoById(
      (req.user as JwtPayload).sub,
    )
    console.log({ userInfo })

    return userInfo
  }
}
