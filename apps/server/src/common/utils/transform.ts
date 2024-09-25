/**
 *用于从环境变量中解析字符串用分隔符分隔表示的数组
 * @param value
 * @returns
 */
export function splitAndTrim(
  value: string,
  separator: string | RegExp = ',',
): string[] {
  return value.split(separator).map((scope) => scope.trim())
}

/**
 * 解析dotenv中bool字符串，如果不符合，则返回默认值
 * @param value
 * @param defaultValue
 * @returns
 */
export function parseBoolString(value: string, defaultValue = false): boolean {
  if (value === 'true') {
    return true
  } else if (value === 'false') {
    return false
  } else {
    return defaultValue
  }
}
