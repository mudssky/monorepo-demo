import { Form, message } from 'antd'
import { FieldType, Props } from '.'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { REGISTER } from '@/api/auth'
// import { omit } from 'lodash'
import { omit } from '@mudssky/jsutils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useSetupHook(props: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const handleRegister = async () => {
    const formValues = (await form.validateFields()) as Required<FieldType>
    console.log({ formValues })
    const res = await REGISTER({
      ...omit(formValues, ['repassword']),
    })
    if (res.code === 0) {
      // navigate('/login')
      console.log('register success')
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
