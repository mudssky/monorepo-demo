import { FORGET_PASSWORD, SEND_FORGET_PASSWORD_CAPTCHA } from '@/api'
import { calculatePasswordStrengthLevel, omit } from '@mudssky/jsutils'
import { Form, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FieldType } from '.'

export function useSetupHook() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [form] = Form.useForm<FieldType>()

  const handleSubmit = async () => {
    const formValues = await form.validateFields()
    console.log({ formValues })

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
    const res = await FORGET_PASSWORD({
      ...omit(formValues, ['repassword']),
    })
    console.log({ res })

    if (res.code === 0) {
      message.success(t('operation success'))
      navigate('/')
    } else {
      message.error(res.msg)
    }
  }

  async function handleSendForgetPasswordCaptcha() {
    const formValues = await form.validateFields(['email'])
    const { email } = formValues
    if (!email) {
      message.warning('邮箱尚未设置')
      return
    }
    const res = await SEND_FORGET_PASSWORD_CAPTCHA({
      email,
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
    handleSendForgetPasswordCaptcha,
  }
}
