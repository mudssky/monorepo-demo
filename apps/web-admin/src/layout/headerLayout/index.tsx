import { LangSwitch } from '@/components/LangSwitch'
import { DownOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, Layout, LayoutProps, MenuProps, Space } from 'antd'
import { useSetupHook } from './hooks'
interface Props extends LayoutProps {}
export default function HeaderLayout(props: Props) {
  const { userInfo, handleLogoutClick } = useSetupHook()
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <div onClick={handleLogoutClick}>退出登录</div>,
    },
  ]

  return (
    <Layout.Header {...props}>
      <div className="flex justify-end">
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
      </div>
    </Layout.Header>
  )
}
