import { create } from 'zustand'
import { localeKey } from '@/i18n'
import { LoginRes } from '@server/src/modules/auth/types'
interface AppState {
  locale: localeKey
  setAntdLocale: (locale: localeKey) => void
  //   bears: number
  //   increase: (by: number) => void
  userInfo?: LoginRes
  setUserInfo: (userInfo: LoginRes) => void
}

export const useAppStore = create<AppState>()((set) => ({
  locale: 'zh_CN',
  userInfo: undefined,
  setAntdLocale(locale) {
    set({ locale })
  },
  setUserInfo(userInfo) {
    set({ userInfo })
  },
}))
