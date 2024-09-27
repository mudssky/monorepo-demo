import { LangSwitch } from '@/components/LangSwitch'
import { DownOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, Layout, LayoutProps, MenuProps, Space } from 'antd'
import UserInfoEditModal from './components/UserInfoEditModal'
import { useSetupHook } from './hooks'
type Props = LayoutProps
export default function HeaderLayout(props: Props) {
  const {
    userInfo,
    isUserInfoEditModalOpen,
    cancelUserInfoEditModal,
    handleLogoutClick,
    showUserInfoEditModal,
    handleUserInfoEditFinish,
    navigate,
  } = useSetupHook()
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <div onClick={handleLogoutClick}>退出登录</div>,
    },
    {
      key: '2',
      label: <div onClick={showUserInfoEditModal}>修改资料</div>,
    },
    {
      key: '3',
      label: <div onClick={() => navigate('/changePassword')}>修改密码</div>,
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
            src={userInfo?.avatarFullUrl ?? ''}
          />
          <Dropdown menu={{ items }}>
            <Space className="text-[16px] text-white">
              <span className="text-white">{userInfo?.name ?? 'xxx'}</span>
              <DownOutlined />
            </Space>
          </Dropdown>
        </Space>
      </div>
      <UserInfoEditModal
        onSubmitFinish={handleUserInfoEditFinish}
        open={isUserInfoEditModalOpen}
        onCancel={cancelUserInfoEditModal}
      ></UserInfoEditModal>
    </Layout.Header>
  )
}
