import request from '@/request/request'

export interface ChatRoomListResDto {
  createdAt: string
  id: string
  name: string
  type: string
  updatedAt: string
  userCount: number
  userIds: string[]
}

export interface GetChatRoomListParams {
  /**
   * 房间名
   */
  roomName?: string
}
/**
 * 获取聊天室列表
 * @param params
 * @returns
 */
export function GET_CHATROOM_LIST(params: GetChatRoomListParams) {
  return request.get<ChatRoomListResDto[]>('/chatroom/getRoomList', {
    params,
  })
}

/**
 * 创建群聊聊天室
 * @param params
 * @returns
 */
export function CREATE_GROUP_CHATROOM(params: GetChatRoomListParams) {
  return request.get<string>('/chatroom/creteGroupChatroom', {
    params,
  })
}
