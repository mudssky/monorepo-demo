import { Files } from '@/components/ReactPlayground/PlaygroundContext'
import { strFromU8, strToU8, unzlibSync, zlibSync } from 'fflate'

export const fileName2Language = (name: string) => {
  const suffix = name.split('.').pop() || ''
  if (['js', 'jsx'].includes(suffix)) return 'javascript'
  if (['ts', 'tsx'].includes(suffix)) return 'typescript'
  if (['json'].includes(suffix)) return 'json'
  if (['css'].includes(suffix)) return 'css'
  return 'javascript'
}

// export const getFilesFromUrl = () => {
//   let files: Files | undefined
//   try {
//     const hash = decodeURIComponent(window.location.hash.slice(1))
//     files = JSON.parse(hash)
//   } catch (error) {
//     console.error(error)
//   }
//   return files
// }
export const getFilesFromUrl = () => {
  let files: Files | undefined
  try {
    const hash = uncompress(window.location.hash.slice(1))
    files = JSON.parse(hash)
  } catch (error) {
    console.error(error)
  }
  return files
}

// 对json进行压缩
export function compress(data: string): string {
  const buffer = strToU8(data)
  const zipped = zlibSync(buffer, { level: 9 })
  const str = strFromU8(zipped, true)
  return btoa(str)
}
// 对json进行解压缩
export function uncompress(base64: string): string {
  const binary = atob(base64)

  const buffer = strToU8(binary, true)
  const unzipped = unzlibSync(buffer)
  return strFromU8(unzipped)
}
