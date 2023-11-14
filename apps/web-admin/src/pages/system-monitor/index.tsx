import { Button, Row } from 'antd'
// import { io } from 'socket.io-client'
import { globalSocketIOConfig, singleTonCustomSocket } from '@/request/socketio'
export default function SystemMonitor() {
  async function connectSocket() {
    const socket = new singleTonCustomSocket(globalSocketIOConfig)
    console.log({ socket })

    // const socket = io('/', {
    //   auth: GlobalStorage.getStorageSync('TOKEN'),
    // })
    // const link = 'http://127.0.0.1:33101'
    // const link = '/'
    // const link = 'http://127.0.0.1'

    // const socket = io(link, {
    //   auth: { token: GlobalStorage.getStorageSync('TOKEN') },
    // })

    // // const socket = io(link, {
    // //   extraHeaders: {
    // //     authorization: GlobalStorage.getStorageSync('TOKEN'),
    // //   },
    // // })
    // socket.emit('message', 'jljlj')

    // socket.emit('echo', 'asfada')
    // socket.on('message', (msg) => {
    //   console.log('收到消息：', msg)
    //   // 在这里处理收到的消息
    // })
    // socket.on('connect_error', (error) => {
    //   console.error('连接错误:', error)
    // })
    // socket.onAny((eventName, ...args) => {
    //   console.log({ eventName, args })
    // })
  }
  return (
    <div>
      <div>
        <span>系统监控</span>
      </div>
      <Row>
        <Button onClick={connectSocket}>建立连接</Button>
      </Row>
    </div>
  )
}
