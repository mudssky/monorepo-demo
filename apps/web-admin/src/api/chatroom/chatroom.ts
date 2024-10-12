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

export interface GetChatroomHistoryParams {
  chatroomId: string
}

export interface ChatHistoryRes {
  chatroomId: string
  content: string
  createTime: string
  id: number
  sender: Sender
  senderId: string
  type: number
  updateTime: string
}

export interface Sender {
  avatarUrl: null
  createdAt: string
  email: string
  githubAuthInfo: null
  githubId: null
  googleAuthInfo: null
  googleId: null
  id: string
  name: string
  nickName: null
  registryType: string
  role: string
  status: string
}
/**
 * 获取聊天历史记录
 * @param params
 * @returns
 */
export function GET_CHATROOM_HISTORY_LIST(params: GetChatroomHistoryParams) {
  return request.get<ChatHistoryRes[]>('/chat-history/list', {
    params,
  })
}
