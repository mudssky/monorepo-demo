import type { FC, PropsWithChildren, ReactNode } from 'react'
import { createContext, useContext } from 'react'
import { matchPath, useLocation, useOutlet } from 'react-router-dom'

interface KeepAliveLayoutProps extends PropsWithChildren {
  keepPaths: Array<string | RegExp>
  keepElements?: Record<string, ReactNode>
  dropByPath?: (path: string) => void
}

type KeepAliveContextType = Omit<Required<KeepAliveLayoutProps>, 'children'>

const keepElements: KeepAliveContextType['keepElements'] = {}

export const KeepAliveContext = createContext<KeepAliveContextType>({
  /** 执行keepAlive的路径 */
  keepPaths: [],
  /** 缓存页面对应的组件 */
  keepElements,
  /**删除特定路径缓存的方法 */
  dropByPath(path: string) {
    keepElements[path] = null
  },
})

/** 判断路径是否匹配keepPaths指定的路径，可以用字符串和正则指定 */
const isKeepPath = (keepPaths: Array<string | RegExp>, path: string) => {
  let isKeep = false
  for (let i = 0; i < keepPaths.length; i++) {
    let item = keepPaths[i]
    if (item === path) {
      isKeep = true
    }
    if (item instanceof RegExp && item.test(path)) {
      isKeep = true
    }
    if (typeof item === 'string' && item.toLowerCase() === path) {
      isKeep = true
    }
  }
  return isKeep
}

export function useKeepOutlet() {
  const location = useLocation()
  const element = useOutlet()

  const { keepElements, keepPaths } = useContext(KeepAliveContext)
  const isKeep = isKeepPath(keepPaths, location.pathname)

  /**如果是keepPath指定的组件，进行缓存 */
  if (isKeep) {
    keepElements![location.pathname] = element
  }

  return (
    <>
      {/* 便利缓存中的组件进行展示 */}
      {Object.entries(keepElements).map(([pathname, element]) => (
        <div
          key={pathname}
          style={{
            height: '100%',
            width: '100%',
            position: 'relative',
            overflow: 'hidden auto',
          }}
          className="keep-alive-page"
          //   路径不匹配的时候隐藏
          hidden={!matchPath(location.pathname, pathname)}
        >
          {element}
        </div>
      ))}
      {/*  展示不需要缓存的组件 */}
      {!isKeep && element}
    </>
  )
}

const KeepAliveLayout: FC<KeepAliveLayoutProps> = (props) => {
  const { keepPaths, ...other } = props

  const { keepElements, dropByPath } = useContext(KeepAliveContext)

  return (
    <KeepAliveContext.Provider
      value={{ keepPaths, keepElements, dropByPath }}
      {...other}
    />
  )
}

export default KeepAliveLayout
