import { useContext } from 'react'
import { MessageRef } from '.'
import { ConfigContext } from './ConfigProvider'

export function useMessage(): MessageRef {
  const { messageRef } = useContext(ConfigContext)

  if (!messageRef) {
    throw new Error('请在最外层添加 ConfigProvider 组件')
  }

  // eslint-disable-next-line react-hooks/refs
  return messageRef.current!
}
