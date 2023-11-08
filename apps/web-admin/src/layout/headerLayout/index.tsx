import { LangSwitch } from '@/components/LangSwitch'
import { DownOutlined } from '@ant-design/icons'
import { Dropdown, Layout, MenuProps, Space } from 'antd'
import { useSetupHook } from './hooks'

export default function HeaderLayout() {
  const { handleLogoutClick } = useSetupHook()
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <div onClick={handleLogoutClick}>退出登录</div>,
    },
  ]

  return (
    <Layout.Header className="flex justify-end">
      <Space>
        <LangSwitch></LangSwitch>
        <Dropdown menu={{ items }}>
          <Space className="text-[16px] text-white">
            <span className="text-white">用户名</span>
            <DownOutlined />
          </Space>
        </Dropdown>
      </Space>
    </Layout.Header>
  )
}
