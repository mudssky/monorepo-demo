import { App, Button, Form, Input, Space } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
interface FieldType {
  roomName: string
  nickName: string
}
interface MessageItem {
  nickName: string
  message: string
}
export default function ChatDemo() {
  const socket = io('/group-chatroom-demo')
  const { message } = App.useApp()
  const [formData, setFormData] = useState<Partial<FieldType>>()
  const [inputValue, setInputValue] = useState('')
  const isChatRoomCreatedMemo = useMemo(() => {
    return formData?.roomName && formData?.nickName
  }, [formData])
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [form] = Form.useForm<FieldType>()
  useEffect(() => {
    socket.on('message', (msg: MessageItem) => {
      console.log(`收到来自房间${formData?.roomName ?? ''}的消息: `, msg)
      setMessages((prev) => [...prev, msg])
      message.info(
        `收到来自房间${formData?.roomName ?? ''}的消息: ` + msg.message,
      )
    })

    return () => {
      socket.off('message')
    }
  }, [])

  const joinRoom = async () => {
    const formValues = await form.validateFields()
    setFormData(formValues)
    try {
      if (formValues?.roomName) {
        await socket.emitWithAck('joinRoom', formValues?.roomName)
        await socket.emit('sendMessage', {
          room: formData?.roomName,
          message: 'Hello, everyone!',
        })
        console.log('Connected to room:', formValues?.roomName)
      } else {
        alert('请输入群聊名')
      }
    } catch (e) {
      console.error(e)
      // 加入房间失败，置空
      setFormData(undefined)
    }
  }

  const sendMessage = () => {
    if (formData?.roomName) {
      if (inputValue.trim() === '') {
        message.warning('请输入要发送的消息')
        return
      }
      socket.emit('sendMessage', {
        roomName: formData?.roomName,
        nickName: formData?.nickName,
        message: inputValue,
      })
    } else {
      alert('请先加入一个群聊')
    }
  }

  return (
    <div className="flex flex-col items-center">
      {!isChatRoomCreatedMemo && (
        <Space>
          <Form form={form} layout="inline">
            <Form.Item<FieldType>
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: '输入群聊名',
                },
              ]}
              name={'roomName'}
            >
              <Input placeholder="输入群聊名" />
            </Form.Item>
            <Form.Item<FieldType>
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: '请输入昵称',
                },
              ]}
              name={'nickName'}
            >
              <Input placeholder="输入昵称" />
            </Form.Item>
          </Form>

          <Button type="primary" onClick={joinRoom}>
            启动群聊
          </Button>
        </Space>
      )}
      {isChatRoomCreatedMemo && (
        <Space>
          <div>当前房间名：{formData?.roomName}</div>
          <div>当前昵称：{formData?.nickName}</div>
          <Input
            placeholder="请输入要发送的消息"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          ></Input>
          <Button type="primary" onClick={sendMessage}>
            发送消息
          </Button>
        </Space>
      )}

      <div className="w-full mt-4 border rounded overflow-y-auto max-h-[600px]">
        <ul className="p-2">
          {messages.map((item, index) => (
            <li key={index} className="py-1 border-b">
              <Space>
                <div className="bg-gray-300 px-2 py-1 rounded">
                  {item.nickName}:
                </div>
                <div className="bg-white rounded-2xl p-[10px]">
                  {item.message}
                </div>
              </Space>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
