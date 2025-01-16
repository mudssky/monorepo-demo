import areadataJson from '@/data/areadata.json'

// 省市，已知省市寻找区
export function findArea(province: string, city: string) {
  console.log({ areadataJson })

  const provinceObj = areadataJson.find((item) => item.name === province)
  const cityObj = provinceObj?.children?.find((item) => item.name === city)
  const area = cityObj?.children?.[0]?.name ?? ''
  // console.log({ provinceObj, cityObj ,area});
  return area
}
