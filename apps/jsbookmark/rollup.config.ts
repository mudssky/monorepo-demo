import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import ts from '@rollup/plugin-typescript'
import { globSync } from 'glob'
import { RollupOptions } from 'rollup'
import jsBookmarkPlugin from './src/rollupPulgin/jsBookmarkPlugin'

const baseConfig: Partial<RollupOptions> = {
  output: {
    format: 'iife',
    dir: 'dist',
  },
  external: [],
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

const config: RollupOptions[] = globSync('src/scripts/*.{ts,js}').map(
  (item) => {
    return {
      input: item,
      ...baseConfig,
    }
  },
)

export default config
