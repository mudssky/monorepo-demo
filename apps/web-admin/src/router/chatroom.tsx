import { ChatPage } from '@/pages/chatroom/chat'
import { CollectionPage } from '@/pages/chatroom/collection'
import { FriendshipPage } from '@/pages/chatroom/friendship'
import { GroupPage } from '@/pages/chatroom/group'
import ChatroomLayout from '@/pages/chatroom/layout'
import { NotificationPage } from '@/pages/chatroom/notification'
import type { CustomRouteObject } from '.'
export const chatroomRouter = {
  path: '/chatroom',
  element: <ChatroomLayout />,
  children: [
    {
      path: '',
      element: <FriendshipPage />,
      title: '好友',
    },
    {
      path: 'group',
      element: <GroupPage />,
      title: '群聊',
    },
    {
      path: 'chat',
      element: <ChatPage />,
      title: '聊天',
    },
    {
      path: 'collection',
      element: <CollectionPage />,
      title: '收藏',
    },
    {
      path: 'notification',
      element: <NotificationPage />,
      title: '通知',
    },
  ],
} satisfies CustomRouteObject
