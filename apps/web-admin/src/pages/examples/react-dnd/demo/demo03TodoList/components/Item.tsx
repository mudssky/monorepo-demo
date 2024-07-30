import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { useDrag } from 'react-dnd'
import { ListItem, useTodoListStore } from '../store'

interface ItemProps {
  data: ListItem
}
export default function Item(props: ItemProps) {
  const { data } = props
  const ref = useRef<HTMLDivElement>(null)
  const [editing, setEditing] = useState(false)
  const [editingContent, setEditingContent] = useState(data.content)

  const updateItem = useTodoListStore((state) => state.updateItem)
  const [{ isDragging }, drag] = useDrag({
    type: 'list-item',
    item: {
      ...data,
    },
    collect(monitor) {
      return {
        isDragging: monitor.isDragging(),
      }
    },
  })
  useEffect(() => {
    drag(ref)
  }, [])
  return (
    <div
      ref={ref}
      className={clsx(
        'h-[100px] border-[2] border-black bg-blue-300  p-[10px]',
        'flex justify-start items-center',
        'text-xl tracking-wide',
        isDragging ? 'bg-white border-dashed' : '',
      )}
      onDoubleClick={() => setEditing(true)}
    >
      <input type="checkbox" className="w-[40px] h-[40px] mr-[10px]"></input>
      <p>
        {editing ? (
          <input
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            onBlur={() => {
              setEditing(false)
              updateItem({
                ...data,
                content: editingContent,
              })
            }}
          />
        ) : (
          data.content
        )}
      </p>
    </div>
  )
}
