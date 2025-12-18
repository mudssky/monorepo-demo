import { Configuration } from '@rspack/cli'
import * as path from 'path'
import { RunScriptWebpackPlugin } from 'run-script-webpack-plugin'
import nodeExternals from 'webpack-node-externals'

// 判断是否是开发环境
const isDev = process.env.NODE_ENV === 'development'

const config: Configuration = {
  context: __dirname,
  mode: isDev ? 'development' : 'production',
  target: 'node', // 必须：指定目标为 Node.js 环境
  entry: {
    main: './src/main.ts', // 入口文件
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
    clean: true, // 每次构建清理 dist
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    extensionAlias: {
      '.js': ['.ts', '.js'],
    },
    // 自动解析tsconfig配置，避免重复定义别名
    tsConfig: path.resolve(__dirname, './tsconfig.json'),
    // alias: {
    //   '@': path.resolve(__dirname, './src'),
    //   '@root': path.resolve(__dirname, './'),
    //   '#prisma': path.resolve(__dirname, './prisma/generated'),
    //   '@monorepo-demo/logger': path.resolve(
    //     __dirname,
    //     '../../packages/nest-logger/src/index.ts',
    //   ),
    //   '@monorepo-demo/redis': path.resolve(
    //     __dirname,
    //     '../../packages/nest-redis/src/index.ts',
    //   ),
    // },
  },
  externals: [
    nodeExternals({
      // 开发环境如果你想利用 Rspack 的 HMR 能力，部分包可能需要 allowlist
      // 但通常后端直接排除所有 node_modules 最稳
      allowlist: isDev
        ? [
            'webpack/hot/poll?100',
            '@monorepo-demo/logger',
            '@monorepo-demo/redis',
          ]
        : ['@monorepo-demo/logger', '@monorepo-demo/redis'],
    }) as any,
  ],
  externalsType: 'commonjs',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                decorators: true, // 必须：开启装饰器支持
              },
              transform: {
                legacyDecorator: true, // 必须：NestJS 依赖旧版装饰器
                decoratorMetadata: true, // 必须：NestJS 依赖元数据
              },
            },
            // 🔥 关键点：这里手动配置 Swagger 插件
            // 代替了 nest-cli.json 的功能
            rspackExperiments: {
              plugins: [
                [
                  '@nestjs/swagger/plugin', // 确保你安装了 @nestjs/swagger
                  {
                    introspectComments: true,
                    classValidatorShim: true, // 开启 class-validator 自动映射
                    dtoFileNameSuffix: ['.dto.ts', '.entity.ts'],
                  },
                ],
              ],
            },
          },
        },
      },
    ],
  },
  plugins: [
    // 开发环境开启热更新插件
    isDev &&
      new RunScriptWebpackPlugin({
        name: 'main.js',
        autoRestart: false, // 让 Nest 的 HMR 逻辑接管，或者设为 true 暴力重启
      }),
  ].filter(Boolean),
  ignoreWarnings: [
    // 这些 Warning 是因为 NestJS 的元数据反射机制与 Rspack/SWC 的打包行为存在细微冲突导致的，但 不影响程序正常运行 。
    {
      module: /src\/modules\/.*\.controller\.ts$/,
      message: /ESModulesLinkingWarning/,
    },
    {
      module: /packages\/.*\.ts$/,
      message: /ESModulesLinkingWarning/,
    },
    {
      message:
        /Critical dependency: the request of a dependency is an expression/,
    },
  ],
  devtool: isDev ? 'eval-source-map' : 'source-map',
}

export default config
