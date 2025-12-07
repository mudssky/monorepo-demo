const { resolve } = require('node:path')
const { FlatCompat } = require('@eslint/eslintrc')
const js = require('@eslint/js')
const globals = require('globals')

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const project = resolve(process.cwd(), 'tsconfig.json')

/*
 * This is a custom ESLint configuration for use with
 * internal (bundled by their consumer) libraries
 * that utilize React.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = [
  {
    ignores: ['**/node_modules/', '**/dist/', '.eslintrc.js'],
  },
  js.configs.recommended,
  ...compat.extends(
    '@vercel/style-guide/eslint/browser',
    '@vercel/style-guide/eslint/typescript',
    '@vercel/style-guide/eslint/react',
  ),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
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
    rules: {
      // add specific rules configurations here
    },
  },
]
