import clsx from 'clsx'
import { FC, Fragment } from 'react'
import { useTodoListStore } from '../store'
import Gap from './Gap'
import Item from './Item'

interface ListProps {
  className?: string | string[]
}

export const List: FC<ListProps> = (props) => {
  const list = useTodoListStore((state) => state.list)
  const cs = clsx('h-full border-2 border-black border-solid', props.className)

  // const trainsitions = useTransition(list, {
  //   from: {
  //     transform: 'translate3d(100%,0,0)',
  //     opacity: 0,
  //   },
  //   enter: {
  //     transform: 'translate3d(0%,0,0)',
  //     opacity: 1,
  //   },
  //   leave: {
  //     transform: 'translate3d(-100%,0,0)',
  //     opacity: 0,
  //   },
  //   keys: list.map((item) => item.id),
  // })
  return (
    <div className={cs}>
      {list.length
        ? list.map((item) => {
            return (
              <Fragment key={item.id}>
                <Gap id={item.id} />
                <Item data={item} />
              </Fragment>
            )
          })
        : '暂无待办事项'}
      <Gap />
    </div>
  )
}
