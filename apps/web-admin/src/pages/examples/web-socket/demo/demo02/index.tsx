import { App, Button, Space } from 'antd'
import { io } from 'socket.io-client'

export default function Demo02() {
  const socket = io('/group-chatroom-demo')
  const { message } = App.useApp()
  return (
    <div>
      <Space>
        <Button
          type="primary"
          onClick={() => {
            const roomName = prompt('输入群聊名')
            if (roomName) {
              socket.on('connect', function () {
                console.log('Connected')

                socket.emit('joinRoom', roomName)

                socket.on('message', (msg) => {
                  console.log('收到来自房间的消息:', msg)
                  message.info('收到来自房间的消息:' + msg)
                })

                socket.emit('sendMessage', {
                  room: roomName,
                  message: 'Hello, everyone!',
                })
              })
              socket.on('disconnect', function () {
                console.log('Disconnected')
              })
            } else {
              alert('请输入群聊名')
            }
          }}
        >
          启动群聊
        </Button>
      </Space>
    </div>
  )
}
