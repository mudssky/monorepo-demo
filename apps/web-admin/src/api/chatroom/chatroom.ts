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

/**
 * 获取单聊房间
 * @param params
 * @returns
 */
export function GET_ONE_TO_ONE_CHATROOM(params: {
  userId1: string
  userId2: string
}) {
  return request.get<string>('/chatroom/queryOneToOneChatroom', {
    params,
  })
}

/**
 * 创建单聊房间
 * @param params
 * @returns
 */
export function CREATE_SINGLE_CHATROOM(params: { friendId: string }) {
  return request.get<string>('/chatroom/createSingleChatroom', {
    params,
  })
}

export interface MemberRes {
  avatarUrl: string
  createdAt: string
  email: string
  id: string
  name: string
  nickName: string
}

/**
 * 获取聊天室成员
 * @param params
 * @returns
 */
export function GET_GROUP_MENMBERS(params: { chatroomId: string }) {
  return request.get<MemberRes[]>('/chatroom/getRoomMemberList', {
    params,
  })
}

/**
 * 邀请指定用户名加入聊天室
 * @param params
 * @returns
 */
export function JOIN_ROOM(params: { chatroomId: string; name: string }) {
  return request.get<string>('/chatroom/joinRoomByUserName', {
    params,
  })
}
