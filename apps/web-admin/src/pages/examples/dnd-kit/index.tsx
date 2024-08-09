import { Tabs, TabsProps } from 'antd'
import Demo01 from './demo/demo01/index'
import Demo02 from './demo/demo02/index'
import Demo03 from './demo/demo03'
import Demo04 from './demo/demo04'
import Demo05 from './demo/demo05'

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'quick start1',
    children: <Demo01 />,
  },
  {
    key: '2',
    label: 'quick start2',
    children: <Demo02 />,
  },
  {
    key: '3',
    label: 'tags',
    children: <Demo03 />,
  },
  {
    key: '4',
    label: 'table-row',
    children: <Demo04 />,
  },
  {
    key: '5',
    label: 'table-column',
    children: <Demo05 />,
  },
]

export default function DndKitDemo() {
  return (
    <div>
      <Tabs defaultActiveKey="1" items={items}></Tabs>
    </div>
  )
}
