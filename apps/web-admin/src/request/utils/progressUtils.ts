/**
 * 进度处理相关工具函数
 */
import type { AxiosProgressEvent } from 'axios'
import { filesizeFormatter } from './fileUtils'

/**
 * 格式化下载进度log信息
 * @param progressEvent Axios进度事件对象
 * @returns 格式化后的进度信息字符串
 */
export function formatProgressMsg(progressEvent: AxiosProgressEvent) {
  return `下载进度:${((progressEvent.progress ?? 0) * 100).toPrecision(
    4,
  )}% Speed:${filesizeFormatter(progressEvent.rate ?? 0)}/s`
}

/**
 * 通用处理下载进度的函数
 * @param progressEvent Axios进度事件对象
 */
export function handleDownloadProgress(progressEvent: AxiosProgressEvent) {
  const progressMsg = formatProgressMsg(progressEvent)
  console.log(progressMsg)
}
