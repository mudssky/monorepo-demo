const { resolve } = require('node:path')
const { FlatCompat } = require('@eslint/eslintrc')
const js = require('@eslint/js')

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const project = resolve(process.cwd(), 'tsconfig.json')

/*
 * This is a custom ESLint configuration for use with
 * typescript packages.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = [
  {
    ignores: ['**/node_modules/', '**/dist/'],
  },
  js.configs.recommended,
  ...compat.extends(
    '@vercel/style-guide/eslint/node',
    '@vercel/style-guide/eslint/typescript',
  ),
  {
    languageOptions: {
      globals: {
        React: true,
        JSX: true,
      },
      parserOptions: {
        project,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          project,
        },
      },
    },
  },
]
