// testmerge

import { merge } from 'lodash-es'
const aa = merge({ a: 1, b: 2, c: { d: 2 } }, { c: { d: 3, p: 3 } })
console.log({ aa })
const ww = typeof null

console.log({ ww })
