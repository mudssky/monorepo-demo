import { LOGIN } from '@/api/auth'
import { GlobalStorage } from '@/global/storage'
import { useAppStore } from '@/store/appStore'
import { Form, message } from 'antd'
// import { Props } from '.'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
export function useSetupHook() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const setUserInfo = useAppStore((state) => state.setUserInfo)
  const [form] = Form.useForm()
  const handleLogin = async () => {
    const formValues = await form.validateFields()
    console.log({ formValues })
    const res = await LOGIN({
      ...formValues,
    })
    if (res.code === 0) {
      message.success(t('login success'))
      GlobalStorage.setStorageSync('TOKEN', res.data.access_token)
      setUserInfo(res.data)
      navigate('/')
    } else {
      message.error(res.msg)
    }
  }
  return { t, pathname, form, navigate, handleLogin }
}
