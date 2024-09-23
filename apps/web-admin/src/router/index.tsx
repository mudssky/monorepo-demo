import { createBrowserRouter, NonIndexRouteObject } from 'react-router-dom'

import AuthRouter from '@/components/AuthRouter'
import { AppLayout } from '@/layout/appLayout'
import { Login } from '@/pages/login'
import { NotFound } from '@/pages/not-found/index'

import DndKitDemo from '@/pages/examples/dnd-kit'
import ReactDndDemo from '@/pages/examples/react-dnd'
import ReactFlowDemo from '@/pages/examples/react-flow'
import UploadDemo from '@/pages/examples/upload'
import WebsocketDemo from '@/pages/examples/web-socket'
import SystemMonitor from '@/pages/system-monitor'

export interface CustomRouteObject extends NonIndexRouteObject {
  title?: string // 路由标题
  needAuth?: boolean // 是否需要鉴权
  // 导航条返回上一页的url
}

const notInLayoutRouter = [
  {
    path: '/login/:provider?',
    element: <Login />,
    title: '登录',
  },
  {
    path: '/register',
    element: <Login />,
    title: '注册',
  },
  {
    path: '/changePassword',
    element: <Login />,
    title: '忘记密码',
  },
  // 404页面配置
  {
    path: '*',
    element: <NotFound />,
    title: '404',
  },
] as const satisfies CustomRouteObject[]
export const routeList = [
  {
    path: '/react-dnd-demo',
    element: <ReactDndDemo />,
  },
  {
    path: '/dnd-kit-demo',
    element: <DndKitDemo />,
  },
  {
    path: '/react-flow-demo',
    element: <ReactFlowDemo />,
  },
  {
    path: '/upload-demo',
    element: <UploadDemo />,
  },
  {
    path: '/websocket-demo',
    element: <WebsocketDemo />,
  },
] as const satisfies CustomRouteObject[]

export const globalRouter = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthRouter>
        <AppLayout />
      </AuthRouter>
    ),
    // 是报错时显示的页面，找不到路由的情况也会显示
    // errorElement: <NotFound></NotFound>,
    children: [
      {
        // index路由是outlet路由匹配但是没有组件默认显示的路由
        index: true,
        // element: <div>测试</div>,
        element: <SystemMonitor />,
      },
      ...routeList,
    ],
  },
  ...notInLayoutRouter,
])
