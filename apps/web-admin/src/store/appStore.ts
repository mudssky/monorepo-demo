import { StoreApi, UseBoundStore, create } from 'zustand'
import { localeKey } from '@/i18n'
import { LoginRes } from '@server/src/modules/auth/types'
import { GET_USER_INFO } from '@/api/user'
import { devtools } from 'zustand/middleware'
interface AppState {
  locale: localeKey
  setAntdLocale: (locale: localeKey) => void
  //   bears: number
  //   increase: (by: number) => void
  userInfo?: Omit<LoginRes, 'access_token'>
  setUserInfo: (userInfo: LoginRes) => void
  getUserInfo: () => void
}

export const useAppStore = create<AppState>()(
  devtools((set) => ({
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
  })),
)

/**
 * 下面时官方提供的自动生成选择器的方法
 * 但是和默认的方式比起来并没方便多少。
 */
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
