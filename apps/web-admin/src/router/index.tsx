import { createBrowserRouter } from 'react-router-dom'

import { NotFound } from '@/pages/not-found/index'
import App from '@/App'
import { AppLayout } from '@/layout/appLayout'

export const globalRouter = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    // 是报错时显示的页面，找不到路由的情况也会显示
    // errorElement: <NotFound></NotFound>,
    children: [
      {
        // index路由是outlet路由匹配但是没有组件默认显示的路由
        index: true,
        element: <App />,
      },
    ],
  },
  // 404页面配置
  {
    path: '*',
    element: <NotFound />,
  },
])
