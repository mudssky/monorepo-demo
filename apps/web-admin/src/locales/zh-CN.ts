import antd_zhCN from 'antd/locale/zh_CN'
import dayjs_zh_CN from 'dayjs/locale/zh-cn'
import zh_CN from './json/zh-CN.json'
export default {
  translation: zh_CN,
  // otherNameSpace:'',
  dayjs: {
    locale: dayjs_zh_CN,
  },
  antd: {
    locale: antd_zhCN,
  },
} as const

// export default {
//   translation: {
//     username: '用户名',
//   },
//   dayjs: {
//     locale: dayjs_zh_CN,
//   },
//   antd: {
//     locale: antd_zhCN,
//   },
// }
