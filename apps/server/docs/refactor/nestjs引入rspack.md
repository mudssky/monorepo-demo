在 2025 年，对于 NestJS 项目来说，使用 **Rspack** 是一个**极具吸引力但需要权衡**的选择。

既然你之前提到**不喜欢“引入太乱”**且**非常依赖 NestJS 的 Swagger CLI 插件**（自动生成文档），那么 Rspack 对你来说可能是把双刃剑。

### 结论先行：怎么样？

*   **编译速度 (DX)**: 🚀 **极快**。比 Webpack 快 10-20 倍，比 `nest start -b swc` 还要快一些（尤其是在热更新 HMR 方面）。
*   **复杂度**: ⚠️ **中等**。NestJS 官方 CLI 默认集成的是 Webpack。用 Rspack 意味着你要脱离 `nest build/start` 的标准流程，自己写配置文件。
*   **最大的坑**: **Swagger CLI 插件失效**。
    *   Nest CLI 的插件是在编译时修改源码 AST 自动加装饰器的。
    *   Rspack 绕过了 Nest CLI，所以你之前配置的 `nest-cli.json` 里的插件**完全不会生效**。
    *   **解决办法**: 必须配置 Rspack 内置的 SWC Loader 来加载 `@nestjs/swagger` 的 SWC 插件版本。

---

### 如果你决定要用，如何配置？

如果你追求极致的启动速度和打包速度，且愿意维护一份配置文件，以下是**最稳健、兼容 Swagger** 的配置方案。

#### 1. 安装依赖
你需要安装 Rspack 核心库以及处理后端打包所需的库。

```bash
pnpm add -D @rspack/cli @rspack/core swc-loader webpack-node-externals run-script-webpack-plugin
```

*   `webpack-node-externals`: 后端打包必装，防止把 `node_modules` 打包进去。
*   `run-script-webpack-plugin`: 用于实现热更新 (HMR)，自动重启服务器。

#### 2. 创建配置文件 `rspack.config.ts`
在项目根目录创建此文件。这是最关键的一步，我们需要在 `builtin:swc-loader` 中手动把 Swagger 插件加回来。

```typescript
import * as path from 'path';
import nodeExternals from 'webpack-node-externals';
import { RunScriptWebpackPlugin } from 'run-script-webpack-plugin';
import { Configuration } from '@rspack/cli';

// 判断是否是开发环境
const isDev = process.env.NODE_ENV === 'development';

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
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@root': path.resolve(__dirname, './'),
      '#prisma': path.resolve(__dirname, './prisma/generated'),
    },
  },
  externals: [
    nodeExternals({
      // 开发环境如果你想利用 Rspack 的 HMR 能力，部分包可能需要 allowlist
      // 但通常后端直接排除所有 node_modules 最稳
      allowlist: isDev ? ['webpack/hot/poll?100'] : [],
    }),
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
  devtool: isDev ? 'eval-source-map' : 'source-map',
};

export default config;
```

#### 3. 修改 `package.json`
放弃 `nest start`，改用 `rspack` 命令。

```json
"scripts": {
  // 开发模式：开启 watch
  "dev": "cross-env NODE_ENV=development rspack build --watch",
  // 生产构建
  "build": "cross-env NODE_ENV=production rspack build"
}
```

#### 4. (可选) 配置 HMR 热更新
为了让开发体验达到极致（修改代码不重启整个进程，只替换模块），你需要修改 `main.ts`。

```typescript
// src/main.ts
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  // Rspack/Webpack HMR 逻辑
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
```

