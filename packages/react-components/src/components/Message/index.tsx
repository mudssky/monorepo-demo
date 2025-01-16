/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CSSProperties,
  FC,
  ReactNode,
  createRef,
  forwardRef,
  useMemo,
} from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import useStore from './useStore'

import { createPortal } from 'react-dom'
import './styles.scss'
import { useTimer } from './useTimer'

export type Position = 'top' | 'bottom'

export interface MessageProps {
  style?: CSSProperties
  className?: string | string[]
  content: ReactNode | string
  duration?: number
  onClose?: (...args: any) => void
  id?: number
  position?: Position
}

export interface MessageRef {
  add: (messageProps: MessageProps) => number
  remove: (id: number) => void
  update: (id: number, messageProps: MessageProps) => void
  clearAll: () => void
}

const MessageItem: FC<MessageProps> = (item) => {
  const { onMouseEnter, onMouseLeave } = useTimer({
    id: item.id!,
    duration: item.duration,
    remove: item.onClose!,
  })

  return (
    <div
      className="message-item"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {item.content}
    </div>
  )
}

export const MessageProvider = forwardRef<MessageRef, object>((props, ref) => {
  const { messageList, add, update, remove, clearAll } = useStore('top')

  // 立刻修改ref，useImperativeHandle有一定延迟
  if ('current' in ref!) {
    ref.current = {
      add,
      update,
      remove,
      clearAll,
    }
  }

  // useImperativeHandle(
  //   ref,
  //   () => {
  //     return {
  //       add,
  //       update,
  //       remove,
  //       clearAll,
  //     }
  //   },
  //   [],
  // )
  // useEffect(() => {
  //   setInterval(() => {
  //     add({
  //       content: Math.random().toString().slice(2, 8),
  //     })
  //   }, 2000)
  // }, [])

  const positions = Object.keys(messageList) as Position[]

  const messageWrapper = (
    <div className="message-wrapper">
      {positions.map((direction) => {
        return (
          <TransitionGroup
            className={`message-wrapper-${direction}`}
            key={direction}
          >
            {messageList[direction].map((item) => {
              //添加nodeRef
              const nodeRef = createRef<HTMLElement>()
              return (
                <CSSTransition
                  key={item.id}
                  timeout={1000}
                  classNames="message"
                  nodeRef={nodeRef}
                >
                  <MessageItem onClose={remove} {...item}></MessageItem>
                </CSSTransition>
              )
            })}
          </TransitionGroup>
        )
      })}
    </div>
  )
  const el = useMemo(() => {
    const el = document.createElement('div')
    el.className = `wrapper`

    document.body.appendChild(el)
    return el
  }, [])

  return createPortal(messageWrapper, el)
})
