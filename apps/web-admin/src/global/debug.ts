export const enableRenderLog = false

/**
 * 用log来调试组件渲染，封装一下，方便开关
 * @param message
 * @param optionalParams
 */
export function debugRenderLog(
  message?: unknown,
  ...optionalParams: unknown[]
) {
  if (enableRenderLog) {
    console.log(message, ...optionalParams)
  }
}
