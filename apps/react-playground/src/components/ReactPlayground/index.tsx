import { Allotment } from 'allotment'
import 'allotment/dist/style.css'
import Header from '@/components/Header'
import CodeEditor from '../CodeEditor'
import Preview from '@/components/Preview'

export default function ReactPlayground() {
  return (
    <div style={{ height: '100vh' }}>
      <Header></Header>
      <Allotment defaultSizes={[100, 100]}>
        <Allotment.Pane minSize={500}>
          <CodeEditor />
        </Allotment.Pane>
        <Allotment.Pane minSize={0}>
          <Preview></Preview>
        </Allotment.Pane>
      </Allotment>
    </div>
  )
}
