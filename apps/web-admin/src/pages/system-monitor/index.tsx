import { Row, Tabs, TabsProps } from 'antd'
import ProcessManage from './components/ProcessManage'
// import { io } from 'socket.io-client'
export default function SystemMonitor() {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '进程',
      children: <ProcessManage />,
    },
    {
      key: '2',
      label: '性能',
      children: 'Content of Tab Pane 2',
    },
  ]

  return (
    <div>
      <div>
        <span>系统监控</span>
      </div>
      <Tabs defaultActiveKey="1" items={items} />
      <Row></Row>
    </div>
  )
}
