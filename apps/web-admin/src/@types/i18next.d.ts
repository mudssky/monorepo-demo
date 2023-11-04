import { defaultNs, LangResources } from '@/i18n'
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNs
    resources: LangResources['en_US']
  }
}
