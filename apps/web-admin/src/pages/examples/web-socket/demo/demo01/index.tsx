/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Space } from 'antd'
import { useEffect } from 'react'
import { io } from 'socket.io-client'

export default function Demo01() {
  // const socket = io('http://localhost:30355/nest-websocket')
  const socket = io('/nest-websocket')
  useEffect(() => {
    socket.on('connect', function () {
      console.log('Connected')
    })

    socket.on('disconnect', function () {
      console.log('Disconnected')
    })

    socket.on('changeEvent', (data) => {
      console.log('changeEvent', { data })
    })

    socket.on('sendBackLater', (data) => {
      console.log('sendBackLater', { data })
    })
    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <Space>
        <Button
          type="primary"
          onClick={async () => {
            socket.emit('findAllNestWebsocket', (response: any) =>
              console.log('findAllNestWebsocket', response),
            )

            socket.emit('findOneNestWebsocket', 1, (response: any) =>
              console.log('findOneNestWebsocket', response),
            )

            socket.emit(
              'createNestWebsocket',
              { name: '123' },
              (response: any) => console.log('createNestWebsocket', response),
            )
            const ack = await socket.emitWithAck('createNestWebsocket', {
              name: '123',
            })
            console.log({ ack })

            socket.emit(
              'updateNestWebsocket',
              { id: 2, name: '356' },
              (response: any) => console.log('updateNestWebsocket', response),
            )
            socket.emit('removeNestWebsocket', 2, (response: any) =>
              console.log('removeNestWebsocket', response),
            )
          }}
        >
          test
        </Button>
        <Button
          type="primary"
          onClick={() => {
            // 2. 切换event
            socket.emit('testChangeEvent', { name: 'test' }, (response: any) =>
              console.log('removeNestWebsocket', response),
            )
          }}
        >
          changeEvent
        </Button>

        <Button
          type="primary"
          onClick={async () => {
            // 3. 后端延迟返回
            socket.emit(
              'sendBackLater',
              { name: 'sendBackLater' },
              (response: any) => console.log('sendBackLater2', response),
            )
            // 延迟返回只能在on函数接收到
            // const ack = await socket.emitWithAck('sendBackLater', {
            //   name: 'sendBackLater',
            // })
            // console.log('sendBackLater2', ack)
          }}
        >
          send back later
        </Button>
      </Space>
    </div>
  )
}
