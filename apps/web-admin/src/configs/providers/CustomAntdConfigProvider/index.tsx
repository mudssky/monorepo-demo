import { App, ConfigProvider } from 'antd'
import { ConfigProviderProps } from 'antd/es/config-provider'

interface Props extends ConfigProviderProps {}

export default function CustomAntdConfigProvider(props: Props) {
  const { children } = props
  return (
    <ConfigProvider {...props}>
      <App>{children}</App>
    </ConfigProvider>
  )
}
