module.exports = {
  extends: 'stylelint-config-standard',
  rules: {
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'], //global是css module中全局覆盖样式的关键字
      },
    ],
  },
}
