export function checkPasswordStrength(password: string) {
  // 定义不同等级的正则表达式
  const regexArr = [
    /(?=.{8,}).*/, // 最少 8 个字符
    /^(?=.*[a-z]).*$/, // 必须包含小写字母
    /^(?=.*[A-Z]).*$/, // 必须包含大写字母
    /^(?=.*\d).*$/, // 必须包含数字
    /^(?=.*[`~!@#$%^&*()_+<>?:"{},./;'[\]]).*$/, // 必须包含特殊字符
  ]

  let strengthLevel = 0
  if (!regexArr[0].test(password ?? '')) {
    return 0
  }

  for (let i = 1; i < regexArr.length; i++) {
    if (regexArr[i].test(password)) {
      strengthLevel++
    }
  }
  // 返回密码强度等级
  return strengthLevel
}

export function calcPercent(current: number, max: number) {
  return (current * 100) / max
}
