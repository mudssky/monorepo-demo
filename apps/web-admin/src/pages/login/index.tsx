import styles from './styles.module.css'

import React from 'react'
import ChangePasswordForm from './components/ChangePasswordForm'
import { LoginPanel } from './components/LoginPanel'
import RegisterForm from './components/RegisterForm'
import { useSetupHook } from './hooks'

function isLoginPage(pathname: string) {
  return /\/login\/?.*/.test(pathname)
}
export const Login = React.memo(function Login() {
  const { pathname } = useSetupHook()

  return (
    <div className={styles['login-container']}>
      {pathname === '/register' && <RegisterForm></RegisterForm>}
      {isLoginPage(pathname) && <LoginPanel></LoginPanel>}
      {pathname === '/changePassword' && <ChangePasswordForm />}
    </div>
  )
})
