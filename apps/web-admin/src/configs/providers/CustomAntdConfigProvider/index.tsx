import { App, ConfigProvider } from 'antd'
import { ConfigProviderProps } from 'antd/es/config-provider'

type Props = ConfigProviderProps

export default function CustomAntdConfigProvider(props: Props) {
  const { children } = props
  return (
    <ConfigProvider {...props}>
      <App>{children}</App>
    </ConfigProvider>
  )
}
