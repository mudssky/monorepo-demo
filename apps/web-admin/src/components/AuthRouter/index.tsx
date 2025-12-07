import { ReactNode, useEffect, useState } from 'react'
import { checkLogin } from '@/api'

interface Props {
  children: ReactNode
}

// 路由鉴权
export default function AuthRouter(props: Props) {
  const [isLogin, setIsLogin] = useState(false)
  const { children } = props

  //目前只进行登录鉴权
  useEffect(() => {
    let isMounted = true
    if (checkLogin()) {
      if (isMounted) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLogin(true)
      }
    }

    return () => {
      isMounted = false
    }
  }, [])

  return <> {isLogin ? children : null}</>
}
