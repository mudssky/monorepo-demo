import { chatroomRouter } from '@/router/chatroom'
import { Divider, Menu, MenuProps } from 'antd'
import { useEffect } from 'react'

import { Outlet, useLocation, useNavigate } from 'react-router-dom'

export default function ChatroomLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const items: MenuProps['items'] = chatroomRouter?.children?.map((item) => {
    return {
      key: item.path,
      label: item.title,
    }
  })

  function getSelectedKeys() {
    return (
      chatroomRouter?.children
        ?.filter((item) => {
          if (item.path === '') {
            return /^\/chatroom\/?$/.test(pathname)
          }
          return pathname.endsWith(item.path)
        })
        ?.map((item) => item.path) ?? []
    )
  }
  const handleMenuItemClick: MenuProps['onClick'] = (info) => {
    const currentPath = chatroomRouter.children?.find(
      (item) => item.path === info.key,
    )?.path
    navigate('/chatroom/' + currentPath)
  }
  useEffect(() => {
    console.log({ pathname })

    return () => {}
  }, [pathname])

  return (
    <div className="bg-white">
      <div className="text-5xl font-bold flex justify-start p-[10px]">
        聊天室
      </div>
      <Divider></Divider>
      <div className="flex flex-row">
        <div className="w-[200px]">
          <Menu
            defaultSelectedKeys={getSelectedKeys()}
            items={items}
            onClick={handleMenuItemClick}
          />
        </div>
        <div className="">
          <Outlet></Outlet>
        </div>
      </div>{' '}
    </div>
  )
}
