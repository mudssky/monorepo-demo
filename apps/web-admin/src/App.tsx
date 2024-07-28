import CustomAntdConfigProvider from '@/configs/providers/CustomAntdConfigProvider'
import CustomQueryClientProvider from '@/configs/providers/CustomQueryClientProvider'
import CustomReactDndProvider from '@/configs/providers/CustomReactDndProvider'
import { debugRenderLog } from '@/global/debug'
import { useManageI18n } from '@/i18n'
import { useAppStore } from '@/store/appStore'
import 'dayjs/locale/zh-cn'
import { RouterProvider } from 'react-router-dom'
import './App.css'
import { globalRouter } from './router'

function App() {
  const { autoInitI18n, globalLocalesData } = useManageI18n()
  autoInitI18n()
  const locale = useAppStore((state) => state.locale)

  debugRenderLog('App')

  return (
    <CustomReactDndProvider>
      <CustomQueryClientProvider>
        <CustomAntdConfigProvider
          locale={globalLocalesData[locale].antd.locale}
        >
          <RouterProvider router={globalRouter} />
        </CustomAntdConfigProvider>
      </CustomQueryClientProvider>
    </CustomReactDndProvider>
  )
}

export default App
