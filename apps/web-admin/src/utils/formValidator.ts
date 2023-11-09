/* eslint-disable @typescript-eslint/no-explicit-any */
import { RuleRender } from 'antd/es/form'

export const equalValidate = (options: {
  filedName: string
  errMsg: string
}): RuleRender => {
  const {
    filedName = 'password',
    errMsg = 'The new password that you entered do not match!',
  } = options
  return ({ getFieldValue }) => ({
    validator(_: any, value: any) {
      if (!value || getFieldValue(filedName) === value) {
        return Promise.resolve()
      }
      return Promise.reject(new Error(errMsg))
    },
  })
}
