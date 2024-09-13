import { AUTH_GITHUB, AuthGithubParams, LOGIN } from '@/api/auth'
import { GlobalStorage } from '@/global/storage'
import { useQuery } from '@/hooks'
import { useAppStore } from '@/store/appStore'
import { Form, message } from 'antd'
import { useEffect } from 'react'
// import { Props } from '.'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
export function useSetupHook() {
  const { t } = useTranslation()
  const { pathname } = useLocation()

  const query = useQuery<{ code: string | null }>()
  const code = query.get('code') ?? ''
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

  const jumpGithubLogin = async () => {
    const serverHost = import.meta.env.VITE_SERVER_HOST
    window.location.href = `${serverHost}/auth/githubLogin`
  }
  const handleGithubLogin = async (params: AuthGithubParams) => {
    const res = await AUTH_GITHUB({
      ...params,
    })
    console.log({ res })
  }

  useEffect(() => {
    console.log({ code })
    if (code) {
      // console.log('ddsad', { code })
      handleGithubLogin({ code })
    }

    return () => {}
  }, [])

  return { t, pathname, form, navigate, handleLogin, jumpGithubLogin }
}
