import { debugRenderLog } from '@/global/debug'
import {
  DesktopOutlined,
  DragOutlined,
  FileOutlined,
  NodeIndexOutlined,
  PieChartOutlined,
  RobotOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Layout, Menu } from 'antd'
import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
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
  {
    label: '拖拽相关',
    key: '拖拽',
    icon: <DragOutlined />,
    children: [
      {
        label: <Link to={'/react-dnd-demo'}> {'react-dnd-demo'}</Link>,
        key: '1-1',
      },
      {
        label: <Link to={'/dnd-kit-demo'}> {'dnd-kit-demo'}</Link>,
        key: '1-2',
      },
    ],
  },
  {
    label: 'workflow',
    key: 'workflow',
    icon: <NodeIndexOutlined />,
    children: [
      {
        label: <Link to={'/react-flow-demo'}> {'react-flow-demo'}</Link>,
        key: '2-1',
      },
    ],
  },
  {
    label: '文件上传',
    key: 'upload',
    icon: <NodeIndexOutlined />,
    children: [
      {
        label: <Link to={'/upload-demo'}> {'upload-demo'}</Link>,
        key: '3-1',
      },
    ],
  },
  {
    label: 'websocket',
    key: 'websocket',
    icon: <NodeIndexOutlined />,
    children: [
      {
        label: <Link to={'/websocket-demo'}> {'websocket-demo'}</Link>,
        key: '4-1',
      },
    ],
  },
  {
    label: '聊天室',
    key: 'chatroom',
    icon: <NodeIndexOutlined />,
    children: [
      {
        label: <Link to={'/chatroom'}> {'chatroom'}</Link>,
        key: '5-1',
      },
    ],
  },
  {
    label: 'AI相关',
    key: 'ai',
    icon: <RobotOutlined />,
    children: [
      {
        label: <Link to={'/ai-demo'}> {'贪吃蛇游戏'}</Link>,
        key: '6-2',
      },
    ],
  },
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
