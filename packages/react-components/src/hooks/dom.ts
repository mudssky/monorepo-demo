import { RefObject, cloneElement, useEffect, useState } from 'react'

const defaultMutateOptions: MutationObserverInit = {
  subtree: true,
  childList: true,
  attributeFilter: ['style', 'class'],
}

export function useMutateObserver(
  nodeOrList: HTMLElement | HTMLElement[],
  callback: MutationCallback,
  options: MutationObserverInit = defaultMutateOptions,
) {
  useEffect(() => {
    if (!nodeOrList) {
      return
    }

    let instance: MutationObserver

    const nodeList = Array.isArray(nodeOrList) ? nodeOrList : [nodeOrList]

    if ('MutationObserver' in window) {
      instance = new MutationObserver(callback)

      nodeList.forEach((element) => {
        instance.observe(element, options)
      })
    }
    return () => {
      instance?.takeRecords()
      instance?.disconnect()
    }
  }, [options, nodeOrList])
}

export type Element =
  | ((state: boolean) => React.ReactElement)
  | React.ReactElement

export const useHover = (element: Element): [React.ReactElement, boolean] => {
  const [state, setState] = useState(false)

  const onMouseEnter = (originalOnMouseEnter?: any) => (event: any) => {
    originalOnMouseEnter?.(event)
    setState(true)
  }
  const onMouseLeave = (originalOnMouseLeave?: any) => (event: any) => {
    originalOnMouseLeave?.(event)
    setState(false)
  }

  if (typeof element === 'function') {
    element = element(state)
  }

  const el = cloneElement(element, {
    onMouseEnter: onMouseEnter(element.props.onMouseEnter),
    onMouseLeave: onMouseLeave(element.props.onMouseLeave),
  })

  return [el, state]
}

export const useScrolling = (ref: RefObject<HTMLElement>): boolean => {
  const [scrolling, setScrolling] = useState<boolean>(false)

  useEffect(() => {
    if (ref.current) {
      let scollingTimer: ReturnType<typeof setTimeout> | number

      const handleScrollEnd = () => {
        setScrolling(false)
      }

      const handleScroll = () => {
        setScrolling(true)
        clearTimeout(scollingTimer)
        scollingTimer = setTimeout(() => handleScrollEnd(), 150)
      }

      ref.current?.addEventListener('scroll', handleScroll)

      return () => {
        if (ref.current) {
          ref.current?.removeEventListener('scroll', handleScroll)
        }
      }
    }
    return () => {}
  }, [ref])

  return scrolling
}
