const prettierConfigCustom = require('@mudssky/prettier-config-custom')

module.exports = {
  ...prettierConfigCustom,
  plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-packagejson'],
}
