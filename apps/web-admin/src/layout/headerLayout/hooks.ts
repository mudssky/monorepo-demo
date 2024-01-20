import { GlobalStorage } from '@/global/storage'
import { globalRouter } from '@/router'
import { useAppStore } from '@/store/appStore'
import { useEffect, useState } from 'react'

export function useSetupHook() {
  const userInfo = useAppStore((state) => state.userInfo)
  const getUserInfo = useAppStore((state) => state.getUserInfo)

  const [isUserInfoEditModalOpen, setIsUserInfoEditModalOpen] = useState(false)

  const handleLogoutClick = async () => {
    GlobalStorage.removeStorageSync('TOKEN')
    globalRouter.navigate('/login')
  }
  const showUserInfoEditModal = () => {
    setIsUserInfoEditModalOpen(true)
  }
  const cancelUserInfoEditModal = () => {
    setIsUserInfoEditModalOpen(false)
  }
  const handleUserInfoEditFinish = () => {
    cancelUserInfoEditModal()
    // getUserInfo()
  }
  useEffect(() => {
    getUserInfo()
    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    userInfo,
    isUserInfoEditModalOpen,
    handleLogoutClick,
    showUserInfoEditModal,
    cancelUserInfoEditModal,
    handleUserInfoEditFinish,
  }
}
