import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/index.css'

// antd 和dayjs配置
import { ConfigProvider } from 'antd'
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import zhCN from 'antd/locale/zh_CN'

import { RouterProvider } from 'react-router-dom'
import { globalRouter } from '@/router/index.tsx'

dayjs.locale('zh-cn')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <RouterProvider router={globalRouter} />
    </ConfigProvider>
  </React.StrictMode>,
)
