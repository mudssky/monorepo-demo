const nestConfig = require('@mudssky/eslint-config-custom/nest')

module.exports = [
  { ignores: ['dist'] },
  ...nestConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: __dirname,
      },
    },
  },
]
