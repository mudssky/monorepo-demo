import { useSyncExternalStore } from 'react'
import { todosStore } from './todoStore.js'

export default function TodosApp() {
  const todos = useSyncExternalStore(
    todosStore.subscribe,
    todosStore.getSnapshot,
  )
  console.log({ todos })

  return (
    <>
      <button onClick={() => todosStore.addTodo()}>Add todo</button>
      <hr />
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text}{' '}
            <div
              onClick={() => todosStore.delTodo(todo.id)}
              className="cursor-pointer text-red-400"
            >
              删除
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
