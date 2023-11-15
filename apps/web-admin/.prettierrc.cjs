const prettierConfigCustom = require('prettier-config-custom')

module.exports = {
  ...prettierConfigCustom,
  plugins: [...prettierConfigCustom.plugins, 'prettier-plugin-tailwindcss'],
}
