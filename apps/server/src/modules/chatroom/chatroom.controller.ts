import { BaseException } from '@/common/exceptions'
import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserInfo } from '../auth'
import { ChatroomService } from './chatroom.service'
import {
  CreateGroupChatroomDto,
  CreateSingleChatroomDto,
} from './dto/create-chatroom.dto'

@ApiTags('chatroom')
@Controller('chatroom')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @ApiOperation({ summary: '创建单聊房间' })
  // ApiQuery不用写 因为@Query装饰器会被自动解析
  // @ApiQuery({ type: CreateSingleChatroomDto })
  @Get('createSingleChatroom')
  async createSingleChatroom(
    @Query() createSingleChatroomDto: CreateSingleChatroomDto,
    @UserInfo('sub') userId: string,
  ) {
    return this.chatroomService.createSingleChatroom(
      createSingleChatroomDto,
      userId,
    )
  }

  @ApiOperation({ summary: '创建群聊房间' })
  @Get('creteGroupChatroom')
  async creteGroupChatroom(
    @Query() createGroupChatroomDto: CreateGroupChatroomDto,
    @UserInfo('sub') userId: string,
  ) {
    return this.chatroomService.creteGroupChatroom(
      createGroupChatroomDto,
      userId,
    )
  }

  @ApiOperation({ summary: '获取用户的聊天房间列表' })
  @Get('getRoomList')
  async getRoomList(@UserInfo('sub') userId: string) {
    return this.chatroomService.getRoomList(userId)
  }

  @ApiOperation({ summary: '获取聊天室成员列表' })
  @Get('getRoomMemberList')
  async getRoomMemberList(@Query('chatroomId') chatroomId: string) {
    if (!chatroomId) {
      throw new BaseException('chatroomId 不能为空')
    }
    return this.chatroomService.getRoomMemberList(chatroomId)
  }

  @ApiOperation({ summary: '获取聊天室所有信息' })
  @Get('getChatroomInfo')
  async getChatroomInfo(@Query('chatroomId') chatroomId: string) {
    if (!chatroomId) {
      throw new BaseException('chatroomId 不能为空')
    }
    return this.chatroomService.getChatroomInfo(chatroomId)
  }

  @ApiOperation({ summary: '获取聊天室所有信息' })
  @Get('join/:id')
  async joinRoom(
    @Param('id') chatroomId: string,
    @UserInfo('sub') userId: string,
  ) {
    if (!chatroomId) {
      throw new BaseException('chatroomId 不能为空')
    }
    return this.chatroomService.joinRoom({ chatroomId, userId })
  }

  async quitRoom(
    @Param('id') chatroomId: string,
    @UserInfo('sub') userId: string,
  ) {
    if (!chatroomId) {
      throw new BaseException('chatroomId 不能为空')
    }
    return this.chatroomService.quitRoom({ chatroomId, userId })
  }
}
