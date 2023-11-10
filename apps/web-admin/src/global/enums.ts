import { ValueOf, createEnum } from '@mudssky/jsutils'

// 新增参观预约 是否需要讲解员
export const passwordStrengthList = createEnum([
  {
    label: '极弱',
    value: 0,
  },
  {
    label: '弱',
    value: 1,
  },
  {
    label: '中',
    value: 2,
  },
  {
    label: '强',
    value: 3,
  },
  {
    label: '极强',
    value: 4,
  },
] as const)

export type passwordStrengthKey = ValueOf<typeof passwordStrengthList>
export const passwordStrengthEnum = createEnum(passwordStrengthList)
