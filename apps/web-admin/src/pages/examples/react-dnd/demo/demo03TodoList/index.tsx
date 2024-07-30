import clsx from 'clsx'
import { GarbageBin } from './components/GarbageBin'
import { List } from './components/List'
import { NewItem } from './components/NewItem'

interface TodoListProps {}

export const TodoList: React.FC<TodoListProps> = (props) => {
  return (
    <div
      className={clsx(
        'w-[1000px] h-[600px] m-auto mt-[100px] p-[10px] ',
        'border-2 border-black border-solid',
        'flex justify-between items-start',
      )}
    >
      <div className="flex-[2] h-full mr-[10px]  overflow-auto">
        <List></List>
      </div>

      <div className="flex-[1] h-full">
        <NewItem />
        <GarbageBin className={'mt-[10px]'} />
      </div>
    </div>
  )
}

export default function Demo03TodoList() {
  return <TodoList></TodoList>
}
