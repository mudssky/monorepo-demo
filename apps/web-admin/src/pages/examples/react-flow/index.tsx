import { Tabs, TabsProps } from 'antd'
import Demo01 from './demo/demo01/index'

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'quick start1',
    children: <Demo01 />,
  },
]

export default function ReactFlowDemo() {
  return (
    <div>
      <Tabs defaultActiveKey="1" items={items}></Tabs>
    </div>
  )
}
