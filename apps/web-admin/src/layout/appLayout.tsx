import { debugRenderLog } from '@/global/debug'
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Layout, Menu, MenuProps } from 'antd'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import HeaderLayout from './headerLayout'
import styles from './style.module.css'

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem
}

const items: MenuItem[] = [
  getItem('Option 1', '1', <PieChartOutlined />),
  getItem('Option 2', '2', <DesktopOutlined />),
  getItem('User', 'sub1', <UserOutlined />, [
    getItem('Tom', '3'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [
    getItem('Team 1', '6'),
    getItem('Team 2', '8'),
  ]),
  getItem('Files', '9', <FileOutlined />),
]

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)

  debugRenderLog('layout')
  return (
    <Layout className={styles['layout-container']}>
      <Layout.Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
        />
      </Layout.Sider>
      <Layout>
        <HeaderLayout></HeaderLayout>
        <Layout.Content className="overflow-auto px-2">
          {/* <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb> */}
          <Outlet></Outlet>
        </Layout.Content>
        {/* <Footer style={{ textAlign: 'center' }}>
          Ant Design ©2023 Created by Ant UED
        </Footer> */}
      </Layout>
    </Layout>
  )
}
