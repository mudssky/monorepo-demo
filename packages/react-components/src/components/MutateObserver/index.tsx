/* eslint-disable react-hooks/refs */

import React, { useLayoutEffect } from 'react'
import { useMutateObserver } from '@/hooks/dom'

interface MutationObserverProps {
  options?: MutationObserverInit
  onMutate?: (mutations: MutationRecord[], observer: MutationObserver) => void
  children: React.ReactElement
}

const MutateObserver: React.FC<MutationObserverProps> = (props) => {
  const { options, onMutate = () => {}, children } = props

  const elementRef = React.useRef<HTMLElement>(null)

  const [target, setTarget] = React.useState<HTMLElement>()

  useMutateObserver(target!, onMutate, options)

  useLayoutEffect(() => {
    setTarget(elementRef.current!)
  }, [])

  if (!children) {
    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return React.cloneElement(children, { ref: elementRef } as any)
}

export default MutateObserver
