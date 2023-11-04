import { OutputChunk, Plugin } from 'rollup'
import fs from 'fs'
import path from 'path'
import terser from 'terser'

/**
 * 生成书签代码，建议在pnpm tsc，然后把生成的js拷贝到rollup config 里面用
 * 放到rollup插件的最后使用
 * @returns
 */
export default function jsBookmarkPlugin(options?: {
  cancelOutput?: boolean //取消默认的输出
}): Plugin {
  return {
    name: 'bookmarklet',
    async generateBundle(outputOptions, bundle) {
      for (const fileName in bundle) {
        //  跳过assets
        if (bundle[fileName].type === 'asset') {
          continue
        }
        const code = (bundle[fileName] as OutputChunk).code

        // const bookmarkletCode = `
        //   javascript:(function() {
        //     ${code}
        //   })();`
        //   因为rollup那里设置了iife输出了，所以这里就不用改了

        const outputPath = `dist/${bundle[fileName].name}_bookmarklet.txt`
        const outputDir = path.dirname(outputPath)
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true })
        }
        const minifiedCode = (await terser.minify(code)).code
        const bookmarkletCode = `javascript:${minifiedCode}`
        fs.writeFileSync(outputPath, bookmarkletCode)
      }

      if (options?.cancelOutput) {
        for (const fileName in bundle) {
          delete bundle[fileName]
        }
      }
    },
  }
}
