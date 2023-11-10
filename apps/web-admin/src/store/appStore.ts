import { StoreApi, UseBoundStore, create } from 'zustand'
import { localeKey } from '@/i18n'
import { LoginRes } from '@server/src/modules/auth/types'
import { GET_USER_INFO } from '@/api/user'
interface AppState {
  locale: localeKey
  setAntdLocale: (locale: localeKey) => void
  //   bears: number
  //   increase: (by: number) => void
  userInfo?: Omit<LoginRes, 'access_token'>
  setUserInfo: (userInfo: LoginRes) => void
  getUserInfo: () => void
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
  async getUserInfo() {
    const res = await GET_USER_INFO()
    set({ userInfo: res.data })
  },
}))

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  const store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (const k of Object.keys(store.getState())) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
  }

  return store
}
