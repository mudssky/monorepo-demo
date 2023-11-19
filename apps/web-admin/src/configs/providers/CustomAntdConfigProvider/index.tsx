import { ConfigProvider } from 'antd'
import { ConfigProviderProps } from 'antd/es/config-provider'

interface Props extends ConfigProviderProps {}

export default function CustomAntdConfigProvider(props: Props) {
  return <ConfigProvider {...props}></ConfigProvider>
}
