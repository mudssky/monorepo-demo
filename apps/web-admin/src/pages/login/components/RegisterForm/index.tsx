import { LangSwitch } from '@/components/LangSwitch'
import { equalValidate } from '@/utils/formValidator'
import { RegisterReq } from '@server/src/modules/auth/types'
import { Button, Col, Form, FormInstance, Input, Row } from 'antd'
import PasswordStrengthChecker from '../PasswordStrengthChecker'
import { useSetupHook } from './hooks'

export interface Props {
  form?: FormInstance
}

export type FieldType = {
  name?: string
  password?: string
  repassword?: string
  email?: string
} & Pick<RegisterReq, 'captcha'>

export default function RegisterForm() {
  const { t, form, navigate, handleRegister, handleSendCaptcha } =
    useSetupHook()
  const currentPassword = Form.useWatch('password', form)
  return (
    <div className="card glass w-[450px]">
      <div className="card-title justify-center">
        <span>{t('register')}</span>
        <LangSwitch></LangSwitch>
      </div>
      <div className="card-body">
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
              {
                type: 'email',
                message: t('email invalid'),
              },
            ]}
          >
            <Input placeholder={t('please input')} />
          </Form.Item>
          <Form.Item<FieldType>
            label={t('password')}
            name="password"
            rules={[
              { required: true, message: t('please-input-your-password') },
            ]}
            help={<PasswordStrengthChecker password={currentPassword} />}
          >
            <Input.Password placeholder={t('please input')} />
          </Form.Item>

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
          <Form.Item<FieldType>
            // label={t('send_captcha')}
            label={t('captcha')}
            name="captcha"
            rules={[
              {
                required: true,
                message: t('please input'),
              },
            ]}
          >
            <Row justify={'space-between'} gutter={10} wrap={false}>
              <Col span={12}>
                <Input placeholder={t('please input')} />
              </Col>
              <Col span={12}>
                <Button type="primary" onClick={handleSendCaptcha}>
                  {t('send_captcha')}
                </Button>
              </Col>
            </Row>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            onClick={handleRegister}
          >
            {t('register')}
          </Button>
          <Button
            type="link"
            onClick={() => navigate('/login', { replace: true })}
          >
            {t('go to login')}
          </Button>
        </Form>
      </div>
    </div>
  )
}
