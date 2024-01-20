import { UPLOAD_SINGLE } from '@/api'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { Upload, UploadProps, message } from 'antd'
import { AxiosProgressEvent } from 'axios'
import { ReactNode, useState } from 'react'

export interface AvaterInfo {
  avatarUrl: string | null //段路径
  avatarFullUrl: string | null //长路径
}
export interface Props extends UploadProps {
  uploadButton?: ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: AvaterInfo
}

export default function CustomUpload(props: Props) {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()
  // const [first, setfirst] = useState(second)
  const {
    listType = 'picture-card',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        setImageUrl(info.file.response?.url)
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
