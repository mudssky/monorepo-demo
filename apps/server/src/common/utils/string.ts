const base62Chars =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

/**
 * 生成任意长度的base62随机字符串
 * @param len
 * @returns
 * @deprecated 直接用generateBase62Code,在npm包中维护了
 */
export function generateRandomStr(len: number) {
  let str = ''
  for (let i = 0; i < len; i++) {
    // 生成0-61的随机数
    const num = Math.floor(Math.random() * 62)
    str += base62Chars.charAt(num)
  }
  return str
}
