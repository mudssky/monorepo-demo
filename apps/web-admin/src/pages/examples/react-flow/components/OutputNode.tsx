import { Handle, Position } from '@xyflow/react'
import { useState } from 'react'
import { toggleAudio } from './Audio'

export function OutputNode() {
  const [isRunning, setIsRuning] = useState(false)

  function handleToggleClick() {
    setIsRuning((isRunning) => !isRunning)
    toggleAudio()
  }

  return (
    <div className={'bg-white shadow-xl p-[20px]'}>
      <Handle type="target" position={Position.Top} />

      <div>
        <p>输出节点</p>
        <button onClick={handleToggleClick}>
          {isRunning ? <span role="img">🔈</span> : <span role="img">🔇</span>}
        </button>
      </div>
    </div>
  )
}
