import { glob } from 'glob'
import ts from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import fs from 'fs'
import path from 'path'
import { minify } from 'terser'
function jsBookmarkPlugin(options) {
  return {
    name: 'bookmarklet',
    async generateBundle(outputOptions, bundle) {
      for (const fileName in bundle) {
        if (bundle[fileName].type === 'asset') {
          continue
        }
        const code = bundle[fileName].code
        const outputPath = `dist/${bundle[fileName].name}_bookmarklet.txt`
        const outputDir = path.dirname(outputPath)
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true })
        }
        const minifiedCode = (await minify(code)).code
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

const baseConfig = {
  output: {
    format: 'iife',
    dir: 'dist',
  },
  external: false,
  plugins: [
    ts({
      tsconfig: './tsconfig.json',
    }),
    resolve(),
    commonjs(),
    jsBookmarkPlugin({
      cancelOutput: true,
    }),
  ],
}

export default glob.globSync('src/scripts/*.{ts,js}').map((item) => {
  const basename = path.basename(item, path.extname(item))
  return {
    input: item,
    ...baseConfig,
  }
})
