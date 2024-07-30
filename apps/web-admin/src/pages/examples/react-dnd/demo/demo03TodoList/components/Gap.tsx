import { generateUUID } from '@mudssky/jsutils'
import clsx from 'clsx'
import { useEffect, useRef } from 'react'
import { useDrop } from 'react-dnd'
import { useTodoListStore } from '../store'
interface GapProps {
  id?: string
}
export default function Gap(props: GapProps) {
  const { id } = props
  const ref = useRef<HTMLDivElement>(null)
  //   const addItem = useTodoListStore((state) => state.addItem)
  const addItem = useTodoListStore((state) => state.addItem)
  const [{ isOver }, drop] = useDrop(() => {
    return {
      accept: 'new-item',
      drop(item) {
        addItem(
          {
            id: generateUUID(),
            status: 'todo',
            content: '待办事项',
          },
          id,
        )
      },
      collect(monitor) {
        return {
          isOver: monitor.isOver(),
        }
      },
    }
  })

  useEffect(() => {
    drop(ref)
  }, [])

  const cs = clsx('h-10', isOver ? 'bg-red-300' : '')

  return <div ref={ref} className={cs}></div>
}
