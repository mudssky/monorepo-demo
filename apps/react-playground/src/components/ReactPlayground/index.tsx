import { Allotment } from 'allotment'
import 'allotment/dist/style.css'
import Header from '@/components/Header'
import CodeEditor from '../CodeEditor'
import Preview from '@/components/Preview'
import './index.scss'
import { useContext } from 'react'
import { PlaygroundContext } from './PlaygroundContext'

export default function ReactPlayground() {
  const { theme } = useContext(PlaygroundContext)
  return (
    <div style={{ height: '100vh' }} className={theme}>
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
