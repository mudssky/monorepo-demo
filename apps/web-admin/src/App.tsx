import './App.css'
import { ConfigProvider } from 'antd'
import { RouterProvider } from 'react-router-dom'
import { globalRouter } from './router'

import 'dayjs/locale/zh-cn'
import { useAppStore } from '@/store/appStore'

import '@/i18n'
import { useManageI18n } from '@/i18n'
import { debugRenderLog } from './global/debug'
function App() {
  const { autoInitI18n, globalLocalesData } = useManageI18n()
  autoInitI18n()
  const locale = useAppStore((state) => state.locale)

  debugRenderLog('App')

  return (
    <ConfigProvider locale={globalLocalesData[locale].antd.locale}>
      <RouterProvider router={globalRouter} />
    </ConfigProvider>
  )
}

export default App
