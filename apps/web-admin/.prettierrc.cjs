const prettierConfigCustom = require('@mudssky/prettier-config-custom')

module.exports = {
  ...prettierConfigCustom,
  plugins: [
    'prettier-plugin-tailwindcss',
    'prettier-plugin-organize-imports',
    'prettier-plugin-packagejson',
  ],
}
