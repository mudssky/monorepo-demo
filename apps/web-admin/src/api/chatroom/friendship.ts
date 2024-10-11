import request from '@/request/request'

export interface FriendListParam {
  /**
   * 好友昵称
   */
  nickName: string
}

export interface FriendshipListRes {
  email: string
  id: string
  name: string
  nickName: string
  avatarUrl: string
}

/**
 * 获取好友列表
 * @param params
 * @returns
 */
export function GET_FRIENDSHIP_LIST(params: FriendListParam) {
  return request.get<FriendshipListRes[]>('/friendship/getFriendship', {
    params,
  })
}

export interface FriendRequestParam {
  /**
   * 申请理由
   */
  reason: string
  /**
   * 添加的好友用户名
   */
  username: string
}

/**
 * 发送好友请求
 * @param params
 * @returns
 */
export function SEND_FRIEND_REQUEST(params: FriendRequestParam) {
  return request.post<FriendshipListRes[]>(
    '/friendship/sendFriendRequest',
    params,
  )
}

export interface FriendReuqestListRes {
  fromMe: FromMe[]
  toMe: ToMe[]
}

export interface FromMe {
  createTime: string
  fromUserId: string
  id: string
  reason: string
  status: number
  toUser: ToUser
  toUserId: string
  updateTime: string
}

export interface ToUser {
  avatarUrl: null
  createdAt: string
  email: string
  githubAuthInfo: null
  githubId: null
  googleAuthInfo: null
  googleId: null
  id: string
  name: string
  nickName: null | string
  registryType: string
  role: string
  status: string
}

export interface FromUser {
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
export interface ToMe {
  createTime?: string
  fromUser?: FromUser
  fromUserId?: string
  id?: string
  reason?: string
  status?: number
  toUserId?: string
  updateTime?: string
}
/**
 *获取用户的好友申请列表，包含用户发出的好友申请和收到的好友申请
 * @returns
 */
export function GET_FRIEND_REQUEST_LIST() {
  return request.get<FriendReuqestListRes>('/friendship/getFriendRequestList')
}

/**
 * 同意好友请求
 * @param requestId
 * @returns
 */
export function ACCEPT_FRIEND_REQUEST(requestId: string) {
  return request.get(`/friendship/agree/${requestId}`)
}

/**
 * 拒绝好友请求
 * @param requestId
 * @returns
 */
export function REJECT_FRIEND_REQUEST(requestId: string) {
  return request.get(`/friendship/reject/${requestId}`)
}
