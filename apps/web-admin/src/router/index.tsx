import { createBrowserRouter } from 'react-router-dom'

import AuthRouter from '@/components/AuthRouter'
import { AppLayout } from '@/layout/appLayout'
import { Login } from '@/pages/login'
import { NotFound } from '@/pages/not-found/index'

import DndKitDemo from '@/pages/examples/dnd-kit'
import ReactDndDemo from '@/pages/examples/react-dnd'
import ReactFlowDemo from '@/pages/examples/react-flow'
import SystemMonitor from '@/pages/system-monitor'

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
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Login />,
  },
  // 404页面配置
  {
    path: '*',
    element: <NotFound />,
  },
])
