import type { $Enums } from '@server/prisma/generated/client'
import request, { CustomRequestConfig } from '@/request/request'
import { FileInfo, PresignedUrlParam } from './types'

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

export interface UploadChunkParam {
  file: File | Blob
  chunkFolderName: string
  chunkIndex: number
}
export function UPLOAD_CHUNK(
  params: UploadChunkParam,
  config: CustomRequestConfig = {},
) {
  return request.post('/upload-file/uploadChunk', params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  })
}

interface MergeChunkParam extends Partial<Pick<UploadSingleParam, 'fileTag'>> {
  chunkPrefix: string
  chunkCount: number
  fileInfo: FileInfo
}

/**
 * 大文件上传合并分片
 * @param params
 * @returns
 */
export function MERGE_CHUNKS(params: MergeChunkParam) {
  return request.post('/upload-file/mergeChunks', params)
}

/**
 * 上传oss获取授权好的put url
 * @param params
 * @returns
 */
export function PRESIGNED_PUT_URL(params: PresignedUrlParam) {
  return request.post<string>('/upload-file/presignedPutUrl', params)
}
