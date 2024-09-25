import { ApiCustomResponse } from '@/common/decorators/swagger'
import { BaseException } from '@/common/exceptions'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserInfo } from '../auth'
import { UserDto } from '../user/dto/user.dto'
import { CreateFriendshipDto } from './dto/create-friendship.dto'
import { FriendshipService } from './friendship.service'

@ApiTags('好友关系')
@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @ApiOperation({ summary: '发送好友请求' })
  @Post('sendFriendRequest')
  async sendFriendRequest(
    @Body() friendAddDto: CreateFriendshipDto,
    @UserInfo() userInfo,
  ) {
    return this.friendshipService.sendFriendRequest(friendAddDto, userInfo)
  }

  @ApiOperation({ summary: '获取用户的好友申请列表' })
  @Get('getFriendRequestList')
  async getFriendRequestList(@UserInfo('sub') userId: string) {
    return this.friendshipService.getFriendRequestList(userId)
  }

  @ApiOperation({ summary: '同意好友申请' })
  @Get('agree/:id')
  async agree(@Param('id') friendId: string, @UserInfo('sub') userId: string) {
    if (!friendId) {
      throw new BaseException('添加的好友 id 不能为空')
    }
    return this.friendshipService.agree({ friendId, userId })
  }

  @ApiOperation({ summary: '拒绝好友申请' })
  @Get('reject/:id')
  async reject(@Param('id') friendId: string, @UserInfo('sub') userId: string) {
    if (!friendId) {
      throw new BaseException('添加的好友 id 不能为空')
    }
    return this.friendshipService.reject({ friendId, userId })
  }

  @ApiOperation({ summary: '删除好友申请' })
  @Get('remove/:id')
  async remove(@Param('id') friendId: string, @UserInfo('sub') userId: string) {
    return this.friendshipService.remove({ friendId, userId })
  }

  @ApiOperation({ summary: '查询好友列表' })
  @ApiCustomResponse({
    type: [UserDto],
  })
  @Get('getFriendship')
  async getFriendship(@UserInfo() userInfo) {
    return this.friendshipService.getFriendship(userInfo)
  }
}
