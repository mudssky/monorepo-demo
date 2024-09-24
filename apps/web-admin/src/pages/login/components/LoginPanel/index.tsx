import { Button, Flex, Form, Input, Row, Space } from 'antd'

import { LangSwitch } from '@/components/LangSwitch'
import { debugRenderLog } from '@/global/debug'
import { GithubOutlined, GoogleOutlined } from '@ant-design/icons'
import { Typography } from 'antd'
import React from 'react'
import { useSetupHook } from './hooks'
const { Text } = Typography

type FieldType = {
  username?: string
  password?: string
  remember?: string
}

function isLoginPage(pathname: string) {
  return /\/login\/?.*/.test(pathname)
}
export const LoginPanel = React.memo(function Login() {
  const {
    pathname,
    t,
    form,
    navigate,
    handleLogin,
    jumpGithubLogin,
    jumpGoogleLogin,
    handleJumpForgetPassword,
  } = useSetupHook()
  console.log({ pathname })

  debugRenderLog('login')
  return (
    <div className="card glass w-[450px]">
      <div className="card-title justify-center">
        <span>{t('system-login')}</span>
        <LangSwitch></LangSwitch>
      </div>
      <div className="card-body">
        {isLoginPage(pathname) ? (
          <Form size="large" form={form}>
            <Form.Item<FieldType>
              // label={t('username')}
              name="username"
              rules={[
                {
                  required: true,
                  message: t('please-input-your-email-or-username'),
                },
              ]}
            >
              <Input placeholder={t('username')} />
            </Form.Item>

            <Form.Item<FieldType>
              // label={t('password')}
              name="password"
              rules={[
                { required: true, message: t('please-input-your-password') },
              ]}
            >
              <Input.Password placeholder={t('password')} />
            </Form.Item>
            <Row justify={'end'} className="h-[16px]">
              <Text
                className={'text-gray-400 cursor-pointer'}
                onClick={handleJumpForgetPassword}
              >
                忘记密码?
              </Text>
            </Row>
            {/* <Form.Item<FieldType>
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}
            >
              <Checkbox>{t('remember-me')}</Checkbox>
            </Form.Item> */}
            <Button
              type="primary"
              htmlType="submit"
              block
              onClick={handleLogin}
            >
              {t('login')}
            </Button>

            <Button
              type="link"
              onClick={() => navigate('/register', { replace: true })}
            >
              {t('go to register')}
            </Button>
            <Flex vertical>
              <Row justify={'center'}>第三方登录</Row>
              <Row justify="center" className="pt-[10px]">
                <Space>
                  <GithubOutlined
                    className="cursor-pointer text-2xl"
                    onClick={jumpGithubLogin}
                  />
                  <GoogleOutlined
                    className="cursor-pointer text-2xl text-red-600"
                    onClick={jumpGoogleLogin}
                  />
                </Space>
              </Row>
            </Flex>
          </Form>
        ) : null}
      </div>
    </div>
  )
})
