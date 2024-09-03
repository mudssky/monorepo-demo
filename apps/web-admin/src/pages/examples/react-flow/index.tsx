import { Tabs, TabsProps } from 'antd'
import Demo01 from './demo/demo01/index'
import Demo02 from './demo/demo02'

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'quick start1',
    children: <Demo01 />,
  },
  {
    key: '2',
    label: 'piano',
    children: <Demo02 />,
  },
]

export default function ReactFlowDemo() {
  return (
    <div>
      <Tabs defaultActiveKey="1" items={items}></Tabs>
    </div>
  )
}
