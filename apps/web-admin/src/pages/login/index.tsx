import { Button, Checkbox, Form, Input, Pagination } from 'antd'
import styles from './styles.module.css'

import { useTranslation } from 'react-i18next'
import React from 'react'
import { LangSwitch } from '@/components/LangSwitch'
import { debugRenderLog } from '@/global/debug'
const onFinish = (values: any) => {
  console.log('Success:', values)
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}

type FieldType = {
  username?: string
  password?: string
  remember?: string
}
export const Login = React.memo(function Login() {
  const { t } = useTranslation()

  debugRenderLog('login')
  return (
    <div className={styles['login-container']}>
      <div className="card glass w-96">
        <div className="card-title justify-center">
          <span>{t('System Login')}</span>
          <LangSwitch></LangSwitch>
        </div>
        <div className="card-body">
          <Pagination showSizeChanger></Pagination>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label={t('username')}
              name="username"
              rules={[
                { required: true, message: 'Please input your username!' },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label={t('password')}
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item<FieldType>
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
})
