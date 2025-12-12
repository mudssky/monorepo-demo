const swcDefaultConfig =
  require('@nestjs/cli/lib/compiler/defaults/swc-defaults').swcDefaultsFactory()
    .swcOptions
const path = require('path')

module.exports = {
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js', '.mjs'],
    extensionAlias: {
      '.js': ['.ts', '.js'],
      '.mjs': ['.mts', '.mjs'],
    },
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@app/redis': path.resolve(__dirname, 'libs/redis/src'),
      '@lib': path.resolve(__dirname, 'libs/index'),
      '@root': path.resolve(__dirname),
      '#prisma': path.resolve(__dirname, 'prisma/generated/client'),
      '@prisma/client': path.resolve(__dirname, 'prisma/generated/client'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: swcDefaultConfig,
        },
      },
    ],
  },
}
