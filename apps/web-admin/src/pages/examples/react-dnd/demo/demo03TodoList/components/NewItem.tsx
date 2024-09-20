import clsx from 'clsx'
import { FC, useEffect, useRef } from 'react'
import { useDrag } from 'react-dnd'

interface NewItemProps {
  className?: string | string[]
}

export const NewItem: FC<NewItemProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: 'new-item',
    item: {},
    collect(monitor) {
      return {
        isDragging: monitor.isDragging(),
      }
    },
  })

  useEffect(() => {
    drag(ref)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const cs = clsx(
    'h-[200px] border-2 border-black border-solid',
    'leading-[100px] text-center text-2xl',
    'bg-green-300',
    'cursor-move select-none',
    isDragging ? 'border-dashed bg-white' : '',
    props.className,
  )

  return (
    <div className={cs} ref={ref}>
      新的待办事项
    </div>
  )
}
