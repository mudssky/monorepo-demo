import { Button, Flex, Form, Input, Row, Space } from 'antd'
import styles from './styles.module.css'

import { LangSwitch } from '@/components/LangSwitch'
import { debugRenderLog } from '@/global/debug'
import { GithubOutlined } from '@ant-design/icons'
import React from 'react'
import RegisterForm from './components/RegisterForm'
import { useSetupHook } from './hooks'

type FieldType = {
  username?: string
  password?: string
  remember?: string
}

export const Login = React.memo(function Login() {
  const { pathname, t, form, navigate, handleLogin, jumpGithubLogin } =
    useSetupHook()
  console.log({ pathname })

  debugRenderLog('login')
  return (
    <div className={styles['login-container']}>
      <div className="card glass w-[450px]">
        <div className="card-title justify-center">
          {pathname === '/login' ? (
            <span>{t('system-login')}</span>
          ) : (
            <span>{t('user register')}</span>
          )}
          <LangSwitch></LangSwitch>
        </div>
        <div className="card-body">
          {pathname == '/login' ? (
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
                  </Space>
                </Row>
              </Flex>
            </Form>
          ) : null}
          {pathname === '/register' ? <RegisterForm></RegisterForm> : null}
        </div>
      </div>
    </div>
  )
})
