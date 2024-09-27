import { PRESIGNED_PUT_URL, UPLOAD_SINGLE } from '@/api'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { generateBase62Code, getFileExt } from '@mudssky/jsutils'
import { Upload, UploadProps, message } from 'antd'
import axios, { AxiosProgressEvent } from 'axios'
import { ReactNode, useState } from 'react'

export interface AvaterInfo {
  avatarUrl: string | null //段路径
  avatarFullUrl: string | null //长路径
}
export interface Props extends UploadProps {
  uploadButton?: ReactNode
  value?: AvaterInfo
  ossPrefix: '/avatar'
}

/**
 *
 * 生成文件名，上传oss不会因文件名重复而覆盖文件
 * @param options
 * @returns
 */
function generateOssFileName(options: { extName: string }) {
  const timeStamp = new Date().getTime()
  return `${timeStamp}${generateBase62Code(10)}${options.extName}`
}
export default function CustomUpload(props: Props) {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()
  // const [first, setfirst] = useState(second)
  const {
    listType = 'picture-card',
    ossPrefix = '/avatar',
    value,
    uploadButton,
    onChange: onValueChange,
    ...restProps
  } = props

  const defaultButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  )

  const currentButton = uploadButton ?? defaultButton

  // useEffect(() => {
  //   console.log({ value })

  //   return () => {}
  // }, [value])

  const customProps: UploadProps = {
    customRequest: async (options) => {
      const fileExt = getFileExt(options.filename ?? '')
      const newFileName = generateOssFileName({
        extName: fileExt,
      })
      const presignRes = await PRESIGNED_PUT_URL({
        objectName: `${ossPrefix}/${newFileName}`,
      })
      if (presignRes.code !== 0) {
        message.error(presignRes.msg)
        return
      }

      const presignedUrl = presignRes.data
      const uploadRes = await axios.put(presignedUrl, options.file)
      console.log({ uploadRes })

      // return
      const res = await UPLOAD_SINGLE(
        {
          fileTag: 'NOTAG',
          file: options.file,
        },
        {
          onDownloadProgress: (e: AxiosProgressEvent) => {
            options?.onProgress?.(e)
          },
        },
      )
      if (res.code === 0) {
        options?.onSuccess?.(res.data)
      } else {
        message.error(res.msg)
        options?.onError?.(new Error(res.msg), res)
        // throw new Error('upload failed')
      }
    },
    onChange: (info) => {
      console.log({ info })

      if (info.file.status === 'uploading') {
        setLoading(true)
        return
      }
      if (info.file.status === 'error' || info.file.status === 'done') {
        setLoading(false)
        // 这里加个api，可以蹭到api转发，这样就不需要知道服务器地址了。
        setImageUrl('/api' + info.file.response?.url)
      }
      onValueChange?.(info)
    },
  }

  const currentImageUrl = value?.avatarFullUrl ?? imageUrl
  return (
    <Upload listType={listType} {...restProps} {...customProps}>
      {currentImageUrl ? (
        <img src={currentImageUrl} alt="avatar" style={{ width: '100%' }} />
      ) : (
        currentButton
      )}
    </Upload>
  )
}
