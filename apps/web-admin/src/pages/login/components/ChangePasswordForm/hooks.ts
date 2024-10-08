import { CHANGE_PASSWORD, SEND_CHANGE_PASSWORD_CAPTCHA } from '@/api'
import { useAppStore } from '@/store/appStore'
import { calculatePasswordStrengthLevel, omit } from '@mudssky/jsutils'
import { Form, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FieldType } from '.'

export function useSetupHook() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [form] = Form.useForm<FieldType>()
  const userInfo = useAppStore((state) => state.userInfo)

  const handleSubmit = async () => {
    const formValues = await form.validateFields()
    console.log({ formValues })
    if (formValues.oldPassword === formValues.newPassword) {
      message.warning(t('new password cannot be the same as old password'))
      return
    }
    if (formValues.newPassword !== formValues.repassword) {
      message.warning(t('new password and repassword can not be same'))
      return
    }
    const passwordStrength = calculatePasswordStrengthLevel(
      formValues.newPassword,
    )
    if (passwordStrength < 2) {
      message.warning(t('password strength is not enough'))
      return
    }
    const res = await CHANGE_PASSWORD({
      ...omit(formValues, ['repassword']),
      email: userInfo?.email,
    })
    console.log({ res })

    if (res.code === 0) {
      message.success(t('operation success'))
      navigate('/')
    } else {
      message.error(res.msg)
    }
  }
  async function handleSendChangePasswordCaptcha() {
    if (userInfo?.email) {
      message.warning('用户邮箱尚未设置')
      return
    }
    const res = await SEND_CHANGE_PASSWORD_CAPTCHA({
      email: userInfo?.email || '',
    })
    if (res.code === 0) {
      message.success(t('operation success'))
    } else {
      message.error(res.msg)
    }
  }
  function handleBack() {
    navigate(-1)
  }

  return {
    t,
    form,
    navigate,
    handleSubmit,
    handleBack,
    handleSendChangePasswordCaptcha,
  }
}
