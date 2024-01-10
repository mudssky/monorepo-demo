import { bytesInstance } from '@mudssky/jsutils'

export const SECOND = 1000
export const MINUTE = 60 * SECOND
export const HOUR = 60 * MINUTE
export const DAY = 24 * HOUR

export const MB = bytesInstance.unitMap['mb']
export const GB = bytesInstance.unitMap['gb']
export const TB = bytesInstance.unitMap['tb']
export const KB = bytesInstance.unitMap['kb']
export const B = bytesInstance.unitMap['b']
