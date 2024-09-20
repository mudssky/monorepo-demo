import {
  AUTH_GITHUB,
  AUTH_GOOGLE,
  GithubCallbackDto,
  LOGIN,
  LoginRes,
} from '@/api'
import { GlobalStorage } from '@/global/storage'
import { useQuery } from '@/hooks'
import { useAppStore } from '@/store/appStore'
import { App, Form } from 'antd'
import { useEffect } from 'react'
// import { Props } from '.'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
export function useSetupHook() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { message } = App.useApp()
  const { provider } = useParams<{ provider: string }>()
  const query = useQuery<{ code: string | null }>()
  const code = query.get('code') ?? ''
  const navigate = useNavigate()
  const setUserInfo = useAppStore((state) => state.setUserInfo)
  const [form] = Form.useForm()

  async function loadAfterLogin(data: LoginRes) {
    message.success(t('login success'))
    GlobalStorage.setStorageSync('TOKEN', data.access_token)
    setUserInfo(data)
    navigate('/')
  }
  const handleLogin = async () => {
    const formValues = await form.validateFields()
    console.log({ formValues })
    const res = await LOGIN({
      ...formValues,
    })
    if (res.code === 0) {
      await loadAfterLogin(res.data)
    } else {
      message.error(res.msg)
    }
  }
  const serverHost = import.meta.env.VITE_SERVER_HOST

  const jumpGithubLogin = async () => {
    window.location.href = `${serverHost}/auth/githubLogin`
  }
  const jumpGoogleLogin = async () => {
    window.location.href = `${serverHost}/auth/googleLogin`
  }

  const handleGithubLogin = async (params: GithubCallbackDto) => {
    const res = await AUTH_GITHUB({
      ...params,
    })
    console.log({ res })
    if (res.code === 0) {
      await loadAfterLogin(res.data)
    } else {
      message.error(res.msg)
    }
  }
  const handleGoogleLogin = async (params: GithubCallbackDto) => {
    const res = await AUTH_GOOGLE({
      ...params,
    })
    console.log({ res })
    if (res.code === 0) {
      await loadAfterLogin(res.data)
    } else {
      message.error(res.msg)
    }
  }
  useEffect(() => {
    console.log({ code, provider })

    if (code && provider === 'github') {
      handleGithubLogin({ code })
    } else if (code && provider === 'google') {
      handleGoogleLogin({ code })
    }

    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    t,
    pathname,
    form,
    navigate,
    handleLogin,
    jumpGithubLogin,
    jumpGoogleLogin,
  }
}
