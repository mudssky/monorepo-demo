import { Row, Tabs, TabsProps } from 'antd'
import PerformanceView from './components/PerformanceView'
import ProcessManage from './components/ProcessManage'
// import { io } from 'socket.io-client'
export default function SystemMonitor() {
  const items: TabsProps['items'] = [
    {
      key: '2',
      label: '性能',
      children: <PerformanceView />,
    },
    {
      key: '1',
      label: '进程',
      children: <ProcessManage />,
    },
  ]

  return (
    <div>
      <Tabs defaultActiveKey="2" items={items} />
      <Row></Row>
    </div>
  )
}
