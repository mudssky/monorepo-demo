import { Button, Form, FormInstance, Input } from 'antd'
import { useSetupHook } from './hooks'

export interface Props {
  form?: FormInstance
}

type FieldType = {
  name?: string
  password?: string
  repassword?: string
  email?: string
}
export default function RegisterForm(props: Props) {
  //   const { form } = props
  const { t, form, navigate, handleRegister } = useSetupHook(props)
  return (
    <Form size="large" form={form}>
      <Form.Item<FieldType>
        label={t('username')}
        name="name"
        rules={[
          {
            required: true,
            message: t('please input'),
          },
        ]}
      >
        <Input placeholder={t('please input')} />
      </Form.Item>

      <Form.Item<FieldType>
        label={t('email')}
        name="email"
        rules={[
          {
            required: true,
            message: t('please input'),
          },
        ]}
      >
        <Input placeholder={t('please input')} />
      </Form.Item>
      <Form.Item<FieldType>
        label={t('password')}
        name="password"
        rules={[{ required: true, message: t('please-input-your-password') }]}
      >
        <Input.Password placeholder={t('please input')} />
      </Form.Item>

      <Form.Item<FieldType>
        label={t('repassword')}
        name="repassword"
        rules={[{ required: true, message: t('please input') }]}
      >
        <Input.Password placeholder={t('please input')} />
      </Form.Item>

      <Button type="primary" htmlType="submit" block onClick={handleRegister}>
        {t('register')}
      </Button>
      <Button type="link" onClick={() => navigate('/login', { replace: true })}>
        {t('go to login')}
      </Button>
    </Form>
  )
}
