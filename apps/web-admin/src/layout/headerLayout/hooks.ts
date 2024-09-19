import { GlobalStorage } from '@/global/storage'
import { useAppStore } from '@/store/appStore'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function useSetupHook() {
  const userInfo = useAppStore((state) => state.userInfo)
  const getUserInfo = useAppStore((state) => state.getUserInfo)

  const navigate = useNavigate()
  const [isUserInfoEditModalOpen, setIsUserInfoEditModalOpen] = useState(false)

  const handleLogoutClick = async () => {
    GlobalStorage.removeStorageSync('TOKEN')
    navigate('/login')
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
    navigate,
  }
}
