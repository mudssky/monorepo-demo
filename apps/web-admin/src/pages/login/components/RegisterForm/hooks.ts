import { Form } from 'antd'
import { Props } from '.'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useSetupHook(props: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const handleRegister = async () => {
    const formValues = await form.validateFields()
    console.log({ formValues })
  }
  return {
    t,
    form,
    navigate,
    handleRegister,
  }
}
