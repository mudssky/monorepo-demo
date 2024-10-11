import { useAppStore } from '@/store/appStore'
import { Input } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface JoinRoomPayload {
  chatroomId: string
  userId: string
}

interface SendMessagePayload {
  sendUserId: string
  chatroomId: string
  message: Message
}

enum MessageTypeEnum {
  TEXT = 10,
  IMAGE = 20,
  FILE = 30,
}

interface Message {
  type: MessageTypeEnum
  content: string
}

type Reply =
  | {
      type: 'sendMessage'
      userId: number
      message: Message
    }
  | {
      type: 'joinRoom'
      userId: number
    }

export function ChatPage() {
  const [messageList, setMessageList] = useState<Array<Message>>([])
  const socketRef = useRef<Socket>()
  const userInfo = useAppStore((state) => state.userInfo)

  useEffect(() => {
    const socket = (socketRef.current = io('/chatroom'))
    socket.on('connect', function () {
      const payload: JoinRoomPayload = {
        chatroomId: '1',
        userId: userInfo?.id,
      }

      socket.emit('joinRoom', payload)

      socket.on('message', (reply: Reply) => {
        if (reply.type === 'joinRoom') {
          setMessageList((messageList) => [
            ...messageList,
            {
              type: MessageTypeEnum.TEXT,
              content: '用户 ' + reply.userId + '加入聊天室',
            },
          ])
        } else {
          setMessageList((messageList) => [...messageList, reply.message])
        }
      })
    })
  }, [])

  function sendMessage(value: string) {
    const payload2: SendMessagePayload = {
      sendUserId: userInfo?.id,
      chatroomId: '1',
      message: {
        type: MessageTypeEnum.TEXT,
        content: value,
      },
    }

    socketRef.current?.emit('sendMessage', payload2)
  }

  return (
    <div>
      <Input
        onBlur={(e) => {
          sendMessage(e.target.value)
        }}
      />
      <div>
        {messageList.map((item) => {
          return (
            <div>
              {item.type === MessageTypeEnum.IMAGE ? (
                <img src={item.content} />
              ) : (
                item.content
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
