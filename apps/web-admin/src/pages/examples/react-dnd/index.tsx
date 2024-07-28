import { Tabs, TabsProps } from 'antd'
import Demo01 from './demo/demo01'

const items: TabsProps['items'] = [
  {
    key: '1',
    label: '拖拽预览样式',
    children: <Demo01 />,
  },
  {
    key: '2',
    label: 'Tab 2',
    children: 'Content of Tab Pane 2',
  },
  {
    key: '3',
    label: 'Tab 3',
    children: 'Content of Tab Pane 3',
  },
]

export default function ReactDndDemo() {
  return (
    <div>
      <Tabs items={items}></Tabs>
    </div>
  )
}
