/* eslint-disable @typescript-eslint/no-explicit-any */

import { generateUUID } from '@mudssky/jsutils'
import { Button, Upload } from 'antd'
import { RcFile } from 'antd/es/upload'
import dayjs from 'dayjs'
import { MERGE_CHUNKS, UPLOAD_CHUNK } from '@/api'

export default function Demo01() {
  return (
    <div>
      <Upload
        customRequest={async (options: any) => {
          console.log({ options })
          const { file } = options
          if (typeof file !== 'string') {
            const chunkSize = 20 * 1024
            const chunks = []
            let startPos = 0
            while (startPos < file.size) {
              chunks.push(file.slice(startPos, startPos + chunkSize))
              startPos += chunkSize
            }

            const fileId = [dayjs().valueOf().toString(), generateUUID()].join(
              '_',
            )

            await Promise.all(
              chunks.map(async (chunk, index) => {
                const res = await UPLOAD_CHUNK({
                  file: chunk,
                  chunkFolderName: fileId,
                  chunkIndex: index,
                })
                if (res.code === 0) {
                  return res.data
                } else {
                  return false
                }
              }),
            )

            await MERGE_CHUNKS({
              chunkPrefix: fileId,
              chunkCount: chunks.length,
              fileInfo: {
                fileSize: file.size,
                originalFileName: (file as RcFile).name,
              },
            })
          } else {
            console.log({ file })
          }
        }}
      >
        <Button>点击大文件上传</Button>
      </Upload>
    </div>
  )
}
