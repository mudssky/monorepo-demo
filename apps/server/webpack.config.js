const swcDefaultConfig =
  require('@nestjs/cli/lib/compiler/defaults/swc-defaults').swcDefaultsFactory()
    .swcOptions
const path = require('path')
const { exec } = require('child_process')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js', '.mjs', '.json'],
    extensionAlias: {
      '.js': ['.ts', '.js'],
      '.mjs': ['.mts', '.mjs'],
    },
    plugins: [
      new TsconfigPathsPlugin({
        // 指定 tsconfig.json 文件的位置（可选，默认会查找项目根目录）
        configFile: path.resolve(__dirname, './tsconfig.json'),
      }),
      {
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap('GenerateDtsPlugin', () => {
            console.log('Generating .d.ts files...')
            exec('npx tsc --emitDeclarationOnly', (err, stdout, stderr) => {
              if (stdout) process.stdout.write(stdout)
              if (stderr) process.stderr.write(stderr)
              if (!err) console.log('Declaration files generated successfully.')
            })
          })
        },
      },
    ],
    // alias: {
    //   '@': path.resolve(__dirname, 'src'),
    //   '@app/redis': path.resolve(__dirname, 'libs/redis/src'),
    //   '@lib': path.resolve(__dirname, 'libs/index'),
    //   '@root': path.resolve(__dirname),
    //   '#prisma/client': path.resolve(__dirname, 'prisma/generated/client'),
    // },
  },
  externals: [
    nodeExternals({
      allowlist: ['webpack/hot/poll?100', /^@monorepo-demo\//],
    }),
  ],
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
