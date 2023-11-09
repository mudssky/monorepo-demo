import { CheckLogin } from '@/api/auth'
import { GlobalStorage } from '@/global/storage'
import { globalRouter } from '@/router'
import { useEffect } from 'react'

export function useSetupHook() {
  const handleLogoutClick = async () => {
    GlobalStorage.removeStorageSync('TOKEN')
    globalRouter.navigate('/login')
  }
  useEffect(() => {
    CheckLogin()

    return () => {}
  }, [])

  return {
    handleLogoutClick,
  }
}
