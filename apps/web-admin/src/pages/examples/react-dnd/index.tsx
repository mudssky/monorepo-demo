import { Tabs, TabsProps } from 'antd'
import Demo01 from './demo/demo01/demo01'
import Demo02Sort from './demo/demo02sort'
import Demo03TodoList from './demo/demo03TodoList'

const items: TabsProps['items'] = [
  {
    key: '1',
    label: '拖拽预览样式',
    children: <Demo01 />,
  },
  {
    key: '2',
    label: '拖拽排序',
    children: <Demo02Sort />,
  },
  {
    key: '3',
    label: 'todolist',
    children: <Demo03TodoList />,
  },
]

export default function ReactDndDemo() {
  return (
    <div>
      <Tabs defaultActiveKey="3" items={items}></Tabs>
    </div>
  )
}
