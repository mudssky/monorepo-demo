import { localeKey, useManageI18n } from '@/i18n'
import { languageSwitchMenu } from '@/locales/switchList'
import { TranslationOutlined } from '@ant-design/icons'
import { Dropdown } from 'antd'

export function LangSwitch() {
  const { changeGlobalLanguage, currentLocaleKey } = useManageI18n()
  return (
    <Dropdown
      menu={{
        items: languageSwitchMenu,
        onClick: (item) => {
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
