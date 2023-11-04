import antd_enUS from 'antd/locale/en_US'

import dayjs_en_US from 'dayjs/locale/zh-cn'
import en_US from './json/en-US.json'
export default {
  translation: en_US,
  // ...en_US,
  dayjs: {
    locale: dayjs_en_US,
  },
  antd: {
    locale: antd_enUS,
  },
} as const

// export default {
//   translation: {
//     username: '用户名',
//   },
//   dayjs: {
//     locale: dayjs_en_US,
//   },
//   antd: {
//     locale: antd_enUS,
//   },
// }
