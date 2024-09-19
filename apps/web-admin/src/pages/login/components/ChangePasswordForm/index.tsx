import { LangSwitch } from '@/components/LangSwitch'
import { Button, Form, FormInstance, Input, Row } from 'antd'
import PasswordStrengthChecker from '../PasswordStrengthChecker'
import { useSetupHook } from './hooks'

export interface Props {
  form?: FormInstance
}

export type FieldType = {
  password: string
  repassword: string
}

export default function ChangePasswordForm() {
  const { t, form, navigate, handleRegister, handleSendCaptcha } =
    useSetupHook()
  const currentPasswordWatch = Form.useWatch('password', form)
  return (
    <div className="card glass w-[450px]">
      <div className="card-title justify-center">
        <span>{t('change password')}</span>
        <LangSwitch></LangSwitch>
      </div>
      <div className="card-body">
        <Form
          size="large"
          form={form}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
        >
          <Form.Item<FieldType>
            label={t('new_password')}
            name="password"
            extra={
              <Row justify={'end'}>
                <PasswordStrengthChecker
                  password={currentPasswordWatch}
                ></PasswordStrengthChecker>
              </Row>
            }
            className="mb-0"
            rules={[
              {
                required: true,
                message: t('please input'),
              },
            ]}
          >
            <Input.Password placeholder={t('please input')} />
          </Form.Item>

          <Form.Item<FieldType>
            label={t('confirm_password')}
            name="repassword"
            rules={[
              {
                required: true,
                message: t('please input'),
              },
              {
                type: 'email',
                message: t('email invalid'),
              },
            ]}
          >
            <Input.Password placeholder={t('please input')} />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            onClick={handleRegister}
          >
            {t('submit')}
          </Button>
        </Form>
      </div>
    </div>
  )
}
