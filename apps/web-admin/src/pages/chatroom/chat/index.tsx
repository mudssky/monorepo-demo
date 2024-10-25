/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ChatHistoryRes,
  ChatRoomListResDto,
  GET_CHATROOM_HISTORY_LIST,
  GET_CHATROOM_LIST,
} from '@/api'
import { useAppStore } from '@/store/appStore'
import data from '@emoji-mart/data'
import EmojiPicker from '@emoji-mart/react'
import { Avatar, Button, Input, message, Popover } from 'antd'
import { UploadChangeParam } from 'antd/es/upload'
import { UploadFile } from 'antd/lib'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'
import { UploadImageModal } from '../components/UploadImageModal'
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: any
    }
  | {
      type: 'joinRoom'
      userId: number
    }

export function ChatPage() {
  const [messageList, setMessageList] = useState<Array<Message>>([])
  const [roomList, setRoomList] = useState<Array<ChatRoomListResDto>>()
  const [chatHistory, setChatHistory] = useState<Array<ChatHistoryRes>>()
  const socketRef = useRef<Socket>()
  const userInfo = useAppStore((state) => state.userInfo)

  const location = useLocation()
  const [inputText, setInputText] = useState('')
  const [roomId, setChatroomId] = useState<string>()
  const [isUploadImageModalOpen, setUploadImageModalOpen] = useState(false)

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
  async function queryChatHistoryList(chatroomId: string) {
    const res = await GET_CHATROOM_HISTORY_LIST({ chatroomId })
    if (res.code === 0) {
      setChatHistory(
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
    if (location.state?.chatroomId) {
      setChatroomId(location.state?.chatroomId)
      queryChatHistoryList(location.state?.chatroomId)
    }
  }, [location.state?.chatroomId])
  useEffect(() => {
    if (!roomId) {
      return
    }

    const socket = (socketRef.current = io('/chatroom'))
    socket.on('connect', function () {
      const payload: JoinRoomPayload = {
        chatroomId: roomId!,
        userId: userInfo?.id,
      }

      socket.emit('joinRoom', payload)

      socket.on('message', (reply: Reply) => {
        // 发送消息后会返回更新人和消息，这样可以直接加到消息列表，不用再请求消息历史接口
        // queryChatHistoryList(roomId!)
        if (reply.type === 'sendMessage') {
          setChatHistory((chatHistory) => {
            return chatHistory
              ? [...chatHistory, reply.message]
              : [reply.message]
          })
          setTimeout(() => {
            document
              .getElementById('bottom-bar')
              ?.scrollIntoView({ block: 'end' })
          }, 300)
        }
      })
    })

    return () => {
      socket.disconnect()
    }
  }, [roomId])
  useEffect(() => {
    queryChatroomList()
    return () => {}
  }, [])

  function sendMessage(options: { type?: MessageTypeEnum; content: string }) {
    const { type = MessageTypeEnum.TEXT, content } = options
    if (!content) {
      return
    }
    if (!roomId) {
      return
    }
    const payload2: SendMessagePayload = {
      sendUserId: userInfo?.id,
      chatroomId: roomId,
      message: {
        type: type,
        content,
      },
    }

    socketRef.current?.emit('sendMessage', payload2)
  }

  async function handleUploadOk(data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    image: UploadChangeParam<UploadFile<any>>
  }) {
    const { image } = data
    const imageUrl = '/api' + image.file.response?.url
    sendMessage({ type: MessageTypeEnum.IMAGE, content: imageUrl })
    setUploadImageModalOpen(false)
  }
  return (
    <div id="chat-container">
      <div className="chat-room-list">
        {roomList?.map((item) => {
          return (
            <div
              className={clsx(
                'chat-room-item',
                item.id === roomId && 'selected',
              )}
              data-id={item.id}
              key={item.id}
              onClick={() => {
                queryChatHistoryList(item.id)
                setChatroomId(item.id)
              }}
            >
              {item.name}
            </div>
          )
        })}
      </div>
      <div className="message-list">
        {chatHistory?.map((item) => {
          return (
            <div
              className={`message-item ${item.senderId === userInfo!.id ? 'from-me' : ''}`}
              data-id={item.id}
              key={item.id}
            >
              <div className="message-sender">
                <Avatar src={item.sender.avatarUrl}></Avatar>
                <span className="sender-nickname">
                  {item.sender.nickName || item.sender.name}
                </span>
              </div>
              <div className="message-content">
                {item.type === MessageTypeEnum.TEXT && (
                  <span>{item.content}</span>
                )}
                {item.type === MessageTypeEnum.IMAGE && (
                  <img
                    src={item.content}
                    alt="图片"
                    className="max-w-[200px]"
                  />
                )}
              </div>
            </div>
          )
        })}
        <div id="bottom-bar" key="bottom-bar"></div>
      </div>
      <div className="message-input">
        <div className="message-type">
          <div className="message-type-item" key={1}>
            <Popover
              content={
                <EmojiPicker
                  data={data}
                  onEmojiSelect={(emoji: { native: string }) => {
                    setInputText((inputText) => inputText + emoji.native)
                  }}
                />
              }
              title="Title"
              trigger="hover"
            >
              表情
            </Popover>
          </div>

          <div
            className="message-type-item"
            key={2}
            onClick={() => {
              setUploadImageModalOpen(true)
            }}
          >
            图片
          </div>
          <div className="message-type-item" key={3}>
            文件
          </div>
        </div>
        <div className="message-input-area">
          <Input.TextArea
            className="message-input-box"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value)
            }}
          />
          <Button
            className="message-send-btn"
            type="primary"
            onClick={() => {
              sendMessage({ content: inputText })
              setInputText('')
            }}
          >
            发送
          </Button>
        </div>
      </div>
      <UploadImageModal
        open={isUploadImageModalOpen}
        handleOk={handleUploadOk}
      ></UploadImageModal>
    </div>
  )
}
