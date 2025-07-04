import {
  CSSProperties,
  FC,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'

interface MyLazyloadProps {
  className?: string
  style?: CSSProperties
  placeholder?: ReactNode
  offset?: string | number
  width?: number | string
  height?: string | number
  onContentVisible?: () => void
  children: ReactNode
}

const MyLazyload: FC<MyLazyloadProps> = (props) => {
  const {
    className = '',
    style,
    offset = 0,
    width,
    onContentVisible,
    placeholder,
    height,
    children,
  } = props

  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  const styles = { height, width, ...style }
  const elementObserver = useRef<IntersectionObserver>(null)

  function lazyLoadHandler(entries: IntersectionObserverEntry[]) {
    const [entry] = entries
    const { isIntersecting } = entry

    if (isIntersecting) {
      setVisible(true)
      onContentVisible?.()

      const node = containerRef.current
      if (node && node instanceof HTMLElement) {
        elementObserver.current?.unobserve(node)
      }
    }
  }
  useEffect(() => {
    const options = {
      rootMargin: typeof offset === 'number' ? `${offset}px` : offset || '0px',
      threshold: 0,
    }

    elementObserver.current = new IntersectionObserver(lazyLoadHandler, options)

    const node = containerRef.current

    if (node instanceof HTMLElement) {
      elementObserver.current.observe(node)
    }
    return () => {
      if (node && node instanceof HTMLElement) {
        elementObserver.current?.unobserve(node)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={containerRef} className={className} style={styles}>
      {visible ? children : placeholder}
    </div>
  )
}

export default MyLazyload
