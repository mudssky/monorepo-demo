import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { useDrag, useDragLayer, useDrop } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import styles from './styles.module.scss'

/**
 * 更改拖拽预览的组件
 * @returns
 */

const DragLayer = () => {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getSourceClientOffset(),
  }))

  if (!isDragging) {
    return null
  }
  return (
    <div
      className={styles['drag-layer']}
      style={{
        left: currentOffset?.x,
        top: currentOffset?.y,
      }}
    >
      {item.color} 拖拖拖
    </div>
  )
}

interface ItemType {
  color: string
}
interface BoxProps {
  color: string
}

function Box(props: BoxProps) {
  const ref = useRef(null)

  const [{ dragging }, drag, dragPreview] = useDrag({
    type: 'box',
    item: {
      color: props.color,
    },
    collect(monitor) {
      return {
        dragging: monitor.isDragging(),
      }
    },
  })

  useEffect(() => {
    drag(ref)
    // 设置预览默认样式为空，这样就不会采用原来的dom作为背景
    // DragLayer就完全作为预览的内容
    dragPreview(getEmptyImage(), { captureDraggingState: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={ref}
      className={clsx(styles.box, dragging && styles.dragging)}
      style={{ background: props.color || 'blue' }}
    ></div>
  )
}

function Container() {
  const ref = useRef(null)
  const [boxes, setBoxes] = useState<ItemType[]>([])

  const [, drop] = useDrop(() => {
    return {
      accept: 'box',
      drop(item: ItemType) {
        // console.log(item)
        setBoxes((boxes) => [...boxes, item])
      },
    }
  })
  drop(ref)

  return (
    <div ref={ref} className={clsx(styles.container, 'flex flex-wrap')}>
      {boxes.map((item, index) => (
        <Box key={index} color={item.color}></Box>
      ))}
    </div>
  )
}

/**
 * 拖拽基本，拖拽预览修改
 * @returns
 */
export default function Demo01() {
  return (
    <div>
      {/* <div>test-react-dnd</div> */}
      <Container></Container>
      <Box color="blue"></Box>
      <Box color="red"></Box>
      <Box color="green"></Box>
      <DragLayer></DragLayer>
    </div>
  )
}
