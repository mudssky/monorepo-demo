import copy from 'copy-to-clipboard'
import React, { FC, ReactElement } from 'react'

interface CopyToClipboardProps {
  text: string
  onCopy?: (text: string, result: boolean) => void
  children: ReactElement
  options?: {
    debug?: boolean
    message?: string
    format?: string
  }
}

const CopyToClipboard: FC<CopyToClipboardProps> = (props) => {
  const { text, onCopy, children, options } = props

  const elem = React.Children.only(children)

  function onClick(event: MouseEvent) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const elem: any = React.Children.only(children)

    const result = copy(text, options)

    if (onCopy) {
      onCopy(text, result)
    }

    if (typeof elem?.props?.onClick === 'function') {
      elem.props.onClick(event)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return React.cloneElement(elem, { onClick } as any)
}

export default CopyToClipboard
