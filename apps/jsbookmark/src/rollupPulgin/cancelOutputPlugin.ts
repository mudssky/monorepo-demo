import { OutputChunk } from 'rollup'
import { Plugin } from 'rollup'

function cancelOutputPlugin(): Plugin {
  return {
    name: 'cancel-output',

    // generateBundle 钩子在生成文件时触发
    generateBundle(outputOptions, bundle) {
      // 取消输出，不写入文件
      for (const fileName in bundle) {
        delete bundle[fileName]
      }
    },
  }
}

export default cancelOutputPlugin
