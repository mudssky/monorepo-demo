export function calcPercent(current?: number, max?: number) {
  if (current === undefined || max === undefined) {
    return 0
  }
  return (current * 100) / max
}

/**
 * 根据百分比数字返回颜色
 * @param percent
 */
export const percentColor = (percent: number) => {
  console.log({ percent })

  if (percent < 60) {
    // return 'green'
    return '#3f8600'
  } else if (percent < 80) {
    return 'orange'
  } else {
    // return 'red'
    return '#cf1322'
  }
}
