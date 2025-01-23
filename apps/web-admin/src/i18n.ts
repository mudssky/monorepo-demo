import dayjs from 'dayjs'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import en_US from '@/locales/en-US'
import zh_CN from '@/locales/zh-CN'
import { useAppStore } from '@/store/appStore'
import { message } from 'antd'
import { useRef } from 'react'
import ReactDOM from 'react-dom'

const resources = {
  en_US,
  zh_CN,
} as const
export type LangResources = typeof resources
export type localeKey = keyof LangResources
export const defaultNs = 'translation'
export const fallBackLng = 'zh_CN'
export const globalLocaleList = Object.keys(resources)
export function useManageI18n() {
  const setAntdLocale = useAppStore((state) => state.setAntdLocale)
  const currentLocaleKey = useAppStore((state) => state.locale)
  // 确保自动加载只会执行一次
  const isInitExcutedRef = useRef<boolean>(false)
  function changeGlobalLanguage(lng: localeKey) {
    if (currentLocaleKey === lng) {
      return
    }
    ReactDOM.unstable_batchedUpdates(() => {
      dayjs.locale(resources[lng].dayjs.locale)
      setAntdLocale(lng)
      message.success('switch language success')
      i18n.changeLanguage(lng)
    })
  }
  function autoInitI18n() {
    if (isInitExcutedRef.current) {
      return
    }
    i18n
      .use(LanguageDetector)
      .use(initReactI18next) // passes i18n down to react-i18next
      .init({
        resources,
        ns: ['translation'],
        fallbackLng: fallBackLng, // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
        // if you're using a language detector, do not define the lng option
        interpolation: {
          escapeValue: false, // react already safes from xss
        },
        detection: {
          // 配置语言检测，我这里不用连接符，因为js变量不支持。
          convertDetectedLanguage: (lng: string) => lng.replace('-', '_'),
        },
      })
    const detectedLanguage = (i18n.language ?? fallBackLng) as localeKey
    // LanguageDetector 检测的语言，会在localstorage里设置
    // console.log({ detectedLanguage })
    dayjs.locale(resources[detectedLanguage].dayjs.locale)
    if (currentLocaleKey !== detectedLanguage) {
      setAntdLocale(detectedLanguage)
    }
    isInitExcutedRef.current = true
  }
  return {
    changeGlobalLanguage,
    autoInitI18n,
    globalLocalesData: resources,
    globalLocaleList,
    currentLocaleKey,
  }
}
export default i18n
