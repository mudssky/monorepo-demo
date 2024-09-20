import { checkLogin } from '@/api'
import { ReactNode, useEffect, useState } from 'react'

interface Props {
  children: ReactNode
}

// 路由鉴权
export default function AuthRouter(props: Props) {
  const [isLogin, setIsLogin] = useState(false)
  const { children } = props

  //目前只进行登录鉴权
  useEffect(() => {
    if (checkLogin()) {
      setIsLogin(true)
    }

    return () => {}
  }, [])

  return <> {isLogin ? children : null}</>
}
