import { LangSwitch } from '@/components/LangSwitch'
import { Button, Col, Form, FormInstance, Input, Row } from 'antd'
import PasswordStrengthChecker from '../PasswordStrengthChecker'
import { useSetupHook } from './hooks'

export interface Props {
  form?: FormInstance
}

export type FieldType = {
  oldPassword: string
  newPassword: string
  repassword: string
  captcha: string
}

export default function ChangePasswordForm() {
  const { t, form, handleSubmit, handleBack, handleSendChangePasswordCaptcha } =
    useSetupHook()
  const currentPasswordWatch = Form.useWatch('newPassword', form)
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
            label={t('old_password')}
            name="oldPassword"
            rules={[
              {
                required: true,
                message: t('please input'),
              },
            ]}
          >
            <Input.Password maxLength={20} placeholder={t('please input')} />
          </Form.Item>
          <Form.Item<FieldType>
            label={t('new_password')}
            name="newPassword"
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
            <Input.Password maxLength={20} placeholder={t('please input')} />
          </Form.Item>

          <Form.Item<FieldType>
            label={t('confirm_password')}
            name="repassword"
            rules={[
              {
                required: true,
                message: t('please input'),
              },
            ]}
          >
            <Input.Password maxLength={20} placeholder={t('please input')} />
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
                <Button
                  type="primary"
                  onClick={handleSendChangePasswordCaptcha}
                >
                  {t('send_captcha')}
                </Button>
              </Col>
            </Row>
          </Form.Item>
          <Button type="primary" htmlType="submit" block onClick={handleSubmit}>
            {t('submit')}
          </Button>
          <Button type="link" block onClick={handleBack}>
            {t('back')}
          </Button>
        </Form>
      </div>
    </div>
  )
}
