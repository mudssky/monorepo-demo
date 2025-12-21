import clsx from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import styles from './styles.module.css'

interface CardItem {
  id: number
  content: string
}

interface CardProps {
  data: CardItem
  index: number
  swapIndex: (fromIndex: number, toIndex: number) => void
}

interface DragData {
  id: number
  index: number
}

function Card(props: CardProps) {
  const { data, swapIndex, index } = props
  const ref = useRef(null)

  const [{ isDragging }, drag] = useDrag<
    DragData,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    { isDragging: boolean }
  >({
    type: 'card',
    item: {
      id: data.id,
      index: index,
    },
    collect(monitor) {
      return {
        isDragging: monitor.isDragging(),
      }
    },
  })
  const [, drop] = useDrop({
    accept: 'card',
    //   可以在drop时触发交换
    // drop(item: DragData) {
    //   swapIndex(index, item.index)
    //   },
    //   也可以在hover时触发交换
    hover(item: DragData) {
      swapIndex(index, item.index)
      item.index = index
    },
  })

  useEffect(() => {
    drag(ref)
    drop(ref)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div ref={ref} className={clsx(styles.card, isDragging && styles.dragging)}>
      {data.content}
    </div>
  )
}
function Demo02Sort() {
  const [cardList, setCardList] = useState<CardItem[]>([
    {
      id: 0,
      content: '000',
    },
    {
      id: 1,
      content: '111',
    },
    {
      id: 2,
      content: '222',
    },
    {
      id: 3,
      content: '333',
    },
    {
      id: 4,
      content: '444',
    },
  ])

  const swapIndex = useCallback((index1: number, index2: number) => {
    const tmp = cardList[index1]
    cardList[index1] = cardList[index2]
    cardList[index2] = tmp
    setCardList([...cardList])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="card-list">
      {cardList.map((item: CardItem, index) => (
        <Card
          data={item}
          swapIndex={swapIndex}
          index={index}
          key={'card_' + item.id}
        />
      ))}
    </div>
  )
}

export default Demo02Sort
