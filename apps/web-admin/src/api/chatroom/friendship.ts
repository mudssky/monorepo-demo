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
