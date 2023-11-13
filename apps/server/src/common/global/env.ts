/**
 * 判断不是生产环境的情况执行代码
 * 一般开发环境需要打印更多log，方便调试
 * @returns
 */
function isNotProd() {
  return process.env.NODE_ENV !== 'production'
}

export const IS_NOT_PROD = isNotProd()
