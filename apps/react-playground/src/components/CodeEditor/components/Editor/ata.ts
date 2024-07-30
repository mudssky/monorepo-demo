import { setupTypeAcquisition } from '@typescript/ata'
import typescriprt from 'typescript'

// @typescript/ata 用于根据源码自动分析出需要的 ts 类型包，然后自动下载

export function createATA(
  onDownloadFile: (code: string, path: string) => void,
) {
  const ata = setupTypeAcquisition({
    projectName: 'my-ata',
    typescript: typescriprt,
    logger: console,
    delegate: {
      receivedFile: (code, path) => {
        console.log('自动下载的包', path)
        onDownloadFile(code, path)
      },
    },
  })

  return ata
}
