import { Form, message } from 'antd'
import { FieldType } from '.'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { REGISTER } from '@/api/auth'
import { omit } from '@mudssky/jsutils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useSetupHook() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const handleRegister = async () => {
    const formValues = (await form.validateFields()) as Required<FieldType>
    console.log({ formValues })
    const res = await REGISTER({
      ...omit(formValues, ['repassword']),
    })
    console.log({ res })

    if (res.code === 0) {
      message.success(t('register success'))
      navigate('/login')
    } else {
      message.error(res.msg)
    }
  }
  return {
    t,
    form,
    navigate,
    handleRegister,
  }
}
