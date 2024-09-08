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
