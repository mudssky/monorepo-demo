import { create } from 'zustand'
import { localeKey } from '@/i18n'
interface AppState {
  locale: localeKey
  setAntdLocale: (locale: localeKey) => void
  //   bears: number
  //   increase: (by: number) => void
}

export const useAppStore = create<AppState>()((set) => ({
  locale: 'zh_CN',
  setAntdLocale(locale) {
    set({ locale })
  },
}))
