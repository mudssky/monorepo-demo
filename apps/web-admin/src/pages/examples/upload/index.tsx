import { Tabs, TabsProps } from 'antd'
import Demo01 from './demo/demo01/index'

const items: TabsProps['items'] = [
  {
    key: '1',
    label: '大文件分片上传',
    children: <Demo01 />,
  },
]

export default function UploadDemo() {
  return (
    <div>
      <Tabs defaultActiveKey="1" items={items}></Tabs>
    </div>
  )
}
