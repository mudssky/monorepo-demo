export enum API_CODE {
  SUCCESS = 0,
  Fail = 1,
}

export const API_MSG = {
  [API_CODE.SUCCESS]: 'Success',
  [API_CODE.Fail]: 'Fail',
}

export const SECOND = 1000
export const MINUTE = 60 * SECOND
export const HOUR = 60 * MINUTE
export const DAY = 24 * HOUR
