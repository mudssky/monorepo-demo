import { UPDATE_USER_INFO } from '@/api'
import { AvaterInfo } from '@/components/CusomSingleUpload'
import { useAppStore } from '@/store/appStore'
import { omit, pick } from '@mudssky/jsutils'
import { Form, UploadFile, message } from 'antd'
import { UploadChangeParam } from 'antd/es/upload'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Props } from '.'

export function convertFileInfo(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: UploadChangeParam<UploadFile<any>>,
): Partial<AvaterInfo> {
  return {
    avatarFullUrl: info.file?.response?.url,
    avatarUrl: info.file?.response?.filePath,
  }
}
interface FormValuesType {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  avatarInfo: any
  nickName: string
}
export function useSetupHook(props: Props) {
  const { open, onSubmitFinish } = props
  const [form] = Form.useForm<FormValuesType>()
  const userInfo = useAppStore((state) => state.userInfo)
  const setUserInfo = useAppStore((state) => state.setUserInfo)
  const getUserInfo = useAppStore((state) => state.getUserInfo)
  const [isConfirmLoading, setIsConfirmLoading] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        ...pick(userInfo, ['name']),
        avatarInfo: {
          avatarUrl: userInfo?.avatarUrl,
          avatarFullUrl: userInfo?.avatarFullUrl,
        },
      })
    } else {
      // 关闭后，更新下用户信息
      getUserInfo()
    }

    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, open, userInfo])

  const handleEditSubmit = async () => {
    const formValues = await form.validateFields()
    console.log({ formValues })
    setIsConfirmLoading(true)
    const res = await UPDATE_USER_INFO({
      ...omit(formValues, ['avatarInfo']),
      avatarUrl: convertFileInfo(formValues.avatarInfo)?.avatarUrl ?? '',
      id: userInfo?.id ?? '',
    })
    if (res.code === 0) {
      message.success(t('opretion_success'))
      setUserInfo({
        ...userInfo!,
        ...res.data,
      })
      onSubmitFinish?.()
    } else {
      message.error(res.msg)
    }
    setIsConfirmLoading(false)
  }

  return {
    form,
    isConfirmLoading,
    handleEditSubmit,
  }
}
