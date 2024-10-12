/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChatRoomListResDto, GET_CHATROOM_LIST } from '@/api'
import { useAppStore } from '@/store/appStore'
import { message } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import './styles.scss'

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
  const [roomList, setRoomList] = useState<Array<ChatRoomListResDto>>()
  const socketRef = useRef<Socket>()
  const userInfo = useAppStore((state) => state.userInfo)

  async function queryChatroomList() {
    const res = await GET_CHATROOM_LIST({
      roomName: '',
    })
    if (res.code === 0) {
      setRoomList(
        res.data.map((item) => {
          return {
            ...item,
            key: item.id,
          }
        }),
      )
    } else {
      message.error(res.msg)
    }
  }
  useEffect(() => {
    queryChatroomList()
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
    <div id="chat-container">
      <div className="chat-room-list">
        {roomList?.map((item) => {
          return (
            <div className="chat-room-item" data-id={item.id} key={item.id}>
              {item.name}
            </div>
          )
        })}
      </div>
      <div className="message-list">
        <div className="message-item">
          <div className="message-sender">
            <img src="http://localhost:9000/chat-room/dong.png" />
            <span className="sender-nickname">神说要有光</span>
          </div>
          <div className="message-content">你好</div>
        </div>
        <div className="message-item">
          <div className="message-sender">
            <img src="http://localhost:9000/chat-room/dong.png" />
            <span className="sender-nickname">神说要有光</span>
          </div>
          <div className="message-content">你好</div>
        </div>
        <div className="message-item from-me">
          <div className="message-sender">
            <img src="http://localhost:9000/chat-room/dong.png" />
            <span className="sender-nickname">神说要有光</span>
          </div>
          <div className="message-content">你好</div>
        </div>
      </div>
    </div>
  )
}
