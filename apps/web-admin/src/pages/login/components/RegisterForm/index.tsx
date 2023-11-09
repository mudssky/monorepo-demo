import { Button, Form, FormInstance, Input } from 'antd'
import { useSetupHook } from './hooks'
import { equalValidate } from '@/utils/formValidator'
import PasswordStrengthChecker from '../PasswordStrengthChecker'

export interface Props {
  form?: FormInstance
}

export type FieldType = {
  name?: string
  password?: string
  repassword?: string
  email?: string
}

export default function RegisterForm() {
  const { t, form, navigate, handleRegister } = useSetupHook()
  const currentPassword = Form.useWatch('password', form)
  return (
    <Form
      size="large"
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
    >
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
      <PasswordStrengthChecker password={currentPassword} />
      <Form.Item<FieldType>
        label={t('repassword')}
        name="repassword"
        rules={[
          { required: true, message: t('please input') },
          equalValidate({
            filedName: 'password',
            errMsg: t('the-new-password-that-you-entered-do-not-match'),
          }),
        ]}
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
