import { useAppStore } from '@/store/appStore'
import { pick } from '@mudssky/jsutils'
import { Form } from 'antd'
import { useEffect } from 'react'
import { Props } from '.'

export function useSetupHook(props: Props) {
  const { open } = props
  const [form] = Form.useForm()
  const userInfo = useAppStore((state) => state.userInfo)

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        ...pick(userInfo, ['name', 'avatarUrl']),
      })
    }

    return () => {}
  }, [open, userInfo])

  return {
    form,
  }
}
