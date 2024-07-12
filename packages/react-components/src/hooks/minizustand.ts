import { useEffect, useState } from 'react'

const createStore = (
  createState: (
    arg0: (partial: (arg0: any) => any, replace: any) => void,
    arg1: () => any,
    arg2: {
      setState: (partial: (arg0: any) => any, replace: any) => void
      getState: () => any
      subscribe: (listener: any) => () => boolean
      destroy: () => void
    },
  ) => any,
) => {
  let state: any
  const listeners = new Set<any>()

  const setState = (partial: (arg0: any) => any, replace: any) => {
    const nextState = typeof partial === 'function' ? partial(state) : partial

    if (!Object.is(nextState, state)) {
      const previousState = state

      if (!replace) {
        state =
          typeof nextState !== 'object' || nextState === null
            ? nextState
            : Object.assign({}, state, nextState)
      } else {
        state = nextState
      }
      listeners.forEach((listener) => listener(state, previousState))
    }
  }

  const getState = () => state

  const subscribe = (listener: any) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  const destroy = () => {
    listeners.clear()
  }

  const api = { setState, getState, subscribe, destroy }

  state = createState(setState, getState, api)

  return api
}

function useStore(api: any, selector: any) {
  const [, forceRender] = useState(0)
  useEffect(() => {
    api.subscribe((state: any, prevState: any) => {
      const newObj = selector(state)
      const oldobj = selector(prevState)

      if (newObj !== oldobj) {
        forceRender(Math.random())
      }
    })
  }, [])
  return selector(api.getState())
}

// useStore可以用react的新方法简化同步state的流程
// function useStore(api, selector) {
//     function getState() {
//         return selector(api.getState());
//     }

//     return useSyncExternalStore(api.subscribe, getState)
// }
export const create = (createState: any) => {
  const api = createStore(createState)

  const useBoundStore = (selector: any) => useStore(api, selector)

  Object.assign(useBoundStore, api)

  return useBoundStore
}
