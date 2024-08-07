import { useDraggable } from '@dnd-kit/core'
interface DraggableProps {
  id?: string
}
export function Draggable(props: React.PropsWithChildren<DraggableProps>) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable',
  })
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  )
}
