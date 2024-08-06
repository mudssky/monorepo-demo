import { useDroppable } from '@dnd-kit/core'
import { CSSProperties } from 'react'
interface DroppableProps {
  children?: React.ReactNode
  id?: string
}
export function Droppable(props: DroppableProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: props?.id ?? 'droppable',
  })
  const style: CSSProperties = {
    color: isOver ? 'red' : undefined,
    fontSize: '30px',
  }

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  )
}
