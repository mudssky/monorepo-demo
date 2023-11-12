import { GlobalStorage } from '@/global/storage'
import { globalRouter } from '@/router'
import { useAppStore } from '@/store/appStore'
import { useEffect } from 'react'

export function useSetupHook() {
  const userInfo = useAppStore((state) => state.userInfo)
  const getUserInfo = useAppStore((state) => state.getUserInfo)

  const handleLogoutClick = async () => {
    GlobalStorage.removeStorageSync('TOKEN')
    globalRouter.navigate('/login')
  }

  useEffect(() => {
    getUserInfo()
    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    userInfo,
    handleLogoutClick,
  }
}
