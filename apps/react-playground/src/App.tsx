import ReactPlayground from '@/components/ReactPlayground/index'

import './App.scss'
import { PlaygroundProvider } from './components/ReactPlayground/PlaygroundProvider'

function App() {
  return (
    <PlaygroundProvider>
      <ReactPlayground />
    </PlaygroundProvider>
  )
}

export default App
