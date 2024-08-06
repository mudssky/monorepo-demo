import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { useState } from 'react'
import { Draggable } from '../demo01/Draggable'
import { Droppable } from '../demo01/Droppable'

export default function Demo02() {
  const containers = ['A', 'B', 'C']
  const [parent, setParent] = useState<React.Key | null>(null)
  const draggableMarkup = <Draggable id="draggable">Drag me</Draggable>

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {parent === null ? draggableMarkup : null}

      {containers.map((id) => (
        // We updated the Droppable component so it would accept an `id`
        // prop and pass it to `useDroppable`
        <Droppable key={id} id={id}>
          {parent === id ? draggableMarkup : 'Drop here'}
        </Droppable>
      ))}
    </DndContext>
  )

  function handleDragEnd(event: DragEndEvent) {
    const { over } = event

    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    setParent(over ? over.id : null)
  }
}
