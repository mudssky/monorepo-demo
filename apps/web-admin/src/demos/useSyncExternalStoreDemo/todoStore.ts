/* eslint-disable @typescript-eslint/no-explicit-any */
// 这是一个第三方 store 的例子，
// 你可能需要把它与 React 集成。

// 如果你的应用完全由 React 构建，
// 我们推荐使用 React state 替代。

let nextId = 0
let todos = [{ id: nextId++, text: 'Todo #1' }]
let listeners: any[] = []

export const todosStore = {
  addTodo() {
    todos = [...todos, { id: nextId++, text: 'Todo #' + nextId }]
    emitChange()
  },
  delTodo(id: number) {
    todos = todos.filter((todo) => todo.id !== id)
    emitChange()
  },
  subscribe(listener: any) {
    listeners = [...listeners, listener]
    //  返回的函数用于取消订阅
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  },
  getSnapshot() {
    return todos
  },
}

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}
