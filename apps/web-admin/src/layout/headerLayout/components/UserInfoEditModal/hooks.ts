import { Form } from 'antd'
import { Props } from '.'

export function useSetupHook(props: Props) {
  const [form] = Form.useForm()

  return {
    form,
  }
}
