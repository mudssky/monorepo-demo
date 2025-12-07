import { TranslationOutlined } from '@ant-design/icons'
import { Dropdown } from 'antd'
import { localeKey, useManageI18n } from '@/i18n'
import { languageSwitchMenu } from '@/locales/switchList'

export function LangSwitch() {
  const { changeGlobalLanguage, currentLocaleKey } = useManageI18n()
  return (
    <Dropdown
      menu={{
        items: languageSwitchMenu,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClick: (item: any) => {
          if (item?.key === currentLocaleKey) {
            return
          }
          changeGlobalLanguage(item!.key as localeKey)
        },
      }}
    >
      <TranslationOutlined className="bg-yellow-400 text-lg" />
    </Dropdown>
  )
}
