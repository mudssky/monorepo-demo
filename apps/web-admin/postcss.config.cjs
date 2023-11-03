module.exports = {
  plugins: {
    'postcss-import': {}, //强化css默认的@import，使其达到scss之类预处理器的效果，支持相对路径，构建时合并等，这个插件要放在最初
    'tailwindcss/nesting': {}, // tailwind 支持嵌套使用@指令，这个插件要放在tailwindcss前面
    tailwindcss: {},
    autoprefixer: {},
  },
}
