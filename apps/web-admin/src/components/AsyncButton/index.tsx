import { Button, ButtonProps } from 'antd'
import React, { useState } from 'react'

interface AsyncButtonProps extends Omit<ButtonProps, 'onClick'> {
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => Promise<void>
}

const AsyncButton = (props: AsyncButtonProps) => {
  const { onClick, ...restProps } = props
  const [loading, setLoading] = useState<boolean>(false)

  const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (onClick) {
      setLoading(true)
      onClick(e).finally(() => setLoading(false))
    }
  }

  return <Button loading={loading} {...restProps} onClick={handleClick} />
}

export default AsyncButton
