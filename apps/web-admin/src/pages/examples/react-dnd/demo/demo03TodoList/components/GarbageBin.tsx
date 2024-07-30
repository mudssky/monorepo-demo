import clsx from 'clsx'
import { FC, useEffect, useRef } from 'react'
import { useDrop } from 'react-dnd'
import { ListItem, useTodoListStore } from '../store'

interface GarbaseProps {
  className?: string | string[]
}

export const GarbageBin: FC<GarbaseProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null)
  const deleteItem = useTodoListStore((state) => state.deleteItem)
  const [{ isOver }, drop] = useDrop(() => {
    return {
      accept: 'list-item',
      drop(item: ListItem) {
        deleteItem(item.id)
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

  const cs = clsx(
    'h-[200px] border-2 border-black border-solid',
    'bg-orange-300',
    'leading-[200px] text-center text-2xl',
    'cursor-move select-none',
    isOver ? 'bg-yellow-400 border-dashed' : '',
    props.className,
  )

  return (
    <div ref={ref} className={cs}>
      垃圾箱
    </div>
  )
}
