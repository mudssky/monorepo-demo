/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from 'react'

export interface FormContextProps {
  values?: Record<string, any>
  setValues?: (values: Record<string, any>) => void
  onValueChange?: (key: string, value: any) => void
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  validateRegister?: (name: string, cb: Function) => void
}

export default createContext<FormContextProps>({})
