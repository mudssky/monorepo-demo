const { resolve } = require('node:path')
const { FlatCompat } = require('@eslint/eslintrc')
const js = require('@eslint/js')
const tseslint = require('typescript-eslint')
const globals = require('globals')

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const project = resolve(process.cwd(), 'tsconfig.json')

module.exports = [
  {
    ignores: ['.eslintrc.js'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...compat.extends('prettier'),
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        project,
        tsconfigRootDir: process.cwd(),
      },
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]
