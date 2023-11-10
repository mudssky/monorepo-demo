import { LangSwitch } from '@/components/LangSwitch'
import { DownOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, Layout, MenuProps, Space } from 'antd'
import { useSetupHook } from './hooks'

export default function HeaderLayout() {
  const { userInfo, handleLogoutClick } = useSetupHook()
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <div onClick={handleLogoutClick}>退出登录</div>,
    },
  ]

  return (
    <Layout.Header className="flex justify-end">
      <Space align="center" size="middle">
        <LangSwitch></LangSwitch>
        <Avatar
          shape="circle"
          size="default"
          className="bg-purple-400 text-green-400"
          icon={<UserOutlined />}
        />
        <Dropdown menu={{ items }}>
          <Space className="text-[16px] text-white">
            <span className="text-white">{userInfo?.name ?? 'xxx'}</span>
            <DownOutlined />
          </Space>
        </Dropdown>
      </Space>
    </Layout.Header>
  )
}
