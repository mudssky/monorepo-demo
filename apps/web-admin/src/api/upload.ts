import request, { CustomRequestConfig } from '@/request/request'
import { $Enums } from '@server/node_modules/prisma/prisma-client'

interface UploadSingleParam {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: any
  fileTag: $Enums.FileTag
}

/**
 * 单文件上传
 * @param param
 * @returns
 */
export function UPLOAD_SINGLE(
  param: UploadSingleParam,
  config: CustomRequestConfig = {},
) {
  return request.post('/upload-file/uploadSingleFile', param, {
    headers: {
      // 0.27版本开始，设置这个header就会自动转换对象为formData
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  })
}
