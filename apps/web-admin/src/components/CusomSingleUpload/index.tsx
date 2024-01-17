import { UPLOAD_SINGLE } from '@/api'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { Upload, UploadProps } from 'antd'
import { AxiosProgressEvent } from 'axios'
import { ReactNode, useEffect, useState } from 'react'
export interface Props extends UploadProps {
  uploadButton?: ReactNode
  value?: any
}

export default function CustomUpload(props: Props) {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()
  const {
    listType = 'picture-card',
    value,
    uploadButton,
    onChange,
    ...restProps
  } = props

  const defaultButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  )

  const handleUpload = async () => {}
  const currentButton = uploadButton ?? defaultButton

  useEffect(() => {
    console.log({ value })

    return () => {}
  }, [value])

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
      }
    },
    onChange: (info) => {
      console.log({ info })

      if (info.file.status === 'uploading') {
        setLoading(true)
        return
      }
      if (info.file.status === 'done') {
        setLoading(false)
        // setImageUrl(info.file.response.data.)
      }
      onChange?.(info)
    },
  }

  return (
    <Upload listType={listType} {...restProps} {...customProps}>
      {imageUrl ? (
        <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
      ) : (
        currentButton
      )}
    </Upload>
  )
}
