import { MenuProps } from 'antd'

export const languageSwitchMenu: MenuProps['items'] = [
  {
    key: 'zh_CN',
    label: '简体中文',
  },
  {
    key: 'en_US',
    label: 'English',
  },
]

export type LanguageSwitchMenuItem = (typeof languageSwitchMenu)[number]
