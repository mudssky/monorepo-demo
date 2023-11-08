import { globalRouter } from '@/router'
// import { redirect, useNavigate } from 'react-router-dom'

export function useSetupHook() {
  //   const navigate = useNavigate()
  //   const [form] = Form.useForm()
  const handleLogoutClick = async () => {
    // dispatch(setUserInfoAction(undefined))
    // delLocalStorage('userInfo')
    // window.location.reload()
    // redirect(globalRouter.navigat)
    globalRouter.navigate('/login')
    // navigate('/login')
  }
  return {
    // form,
    handleLogoutClick,
  }
}
