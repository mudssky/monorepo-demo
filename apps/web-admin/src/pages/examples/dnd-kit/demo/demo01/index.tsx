import { DndContext, DragEndEvent } from '@dnd-kit/core'

import { useState } from 'react'
import { Draggable } from './Draggable'
import { Droppable } from './Droppable'

export default function Demo01() {
  const [isDropped, setIsDropped] = useState(false)
  const draggableMarkup = <Draggable>Drag me</Draggable>

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {!isDropped ? draggableMarkup : null}
      <Droppable>{isDropped ? draggableMarkup : 'Drop here'}</Droppable>
    </DndContext>
  )

  function handleDragEnd(event: DragEndEvent) {
    if (event.over && event.over.id === 'droppable') {
      setIsDropped(true)
    }
  }
}
