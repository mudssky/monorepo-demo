import { SetStateAction, useCallback, useEffect, useRef, useState } from 'react'

/**
 * 封装组件属性支持受控组件和非受控组件的逻辑,
 * 也可以用ahooks的useControllableValue实现类似的功能
 * @param defaultStateValue
 * @param props
 * @returns
 */
export function useMergeState<T>(
  defaultStateValue: T,
  props?: {
    defaultValue?: T
    value?: T
    onChange?: (value: T) => void
  },
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const { defaultValue, value: propsValue, onChange } = props || {}

  const isFirstRender = useRef(true)

  // state初始值设置，如果有传入value则为采用value的受控模式
  // 否则为非受控模式，采用defaultValue
  // 同时，如果defaultValue和value都为空，则采用defaultStateValue
  const [stateValue, setStateValue] = useState<T>(() => {
    if (propsValue !== undefined) {
      return propsValue!
    } else if (defaultValue !== undefined) {
      return defaultValue!
    } else {
      return defaultStateValue
    }
  })

  // 非受控组件的情况，初始赋值value为undefined，但是如果后续propsValue传值，则需要更新stateValue
  useEffect(() => {
    if (propsValue === undefined && !isFirstRender.current) {
      setStateValue(propsValue!)
    }

    isFirstRender.current = false
  }, [propsValue])

  // 根据是否传value值，判断是否为受控模式
  // 受控模式，值完全按照propsValue来
  // 非受控模式，值也可以通过propsValue传递，也可以setStateValue来设置。
  const mergedValue = propsValue === undefined ? stateValue : propsValue

  function isFunction(value: unknown): value is Function {
    return typeof value === 'function'
  }

  /**
   * 处理onChange调用的逻辑
   * 无论受控还是非受控组件，都要调用onChange
   * 但是非受控情况下，还会调用setStateValue更新组件内部的state
   *
   *
   * 这里用useCallback保证传出的setState引用不变。
   */
  const setState = useCallback(
    (value: SetStateAction<T>) => {
      let res = isFunction(value) ? value(stateValue) : value
      if (propsValue === undefined) {
        setStateValue(res)
      }
      onChange?.(res)
    },
    [stateValue],
  )

  return [mergedValue, setState]
}
