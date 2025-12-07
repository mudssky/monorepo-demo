## 问题原因
- 使用 `@prisma/client@7.1.0`，Prisma 的生成代码采用 ESM/Node 风格，在 `*.ts` 源文件中显式引用同目录的 `*.js` 文件（例如 `import * as $Enums from "./enums.js"`）。
- 代码位置：`apps/server/prisma/generated/client.ts:18-22`、`apps/server/prisma/generated/internal/class.ts:15-16`、`apps/server/prisma/generated/models.ts:11-22`。
- 服务器当前构建开启了 webpack（`nest-cli.json` 中 `compilerOptions.webpack: true`，`builder: swc`），webpack 在打包阶段会按照 import 的扩展名严格解析实际文件。生成目录只有 `*.ts`，并不存在对应的 `*.js` 文件，因而出现 `Can't resolve './internal/class.js'` 等错误。
- 现有 webpack 配置 (`apps/server/webpack.config.js:6-20`) 仅包含 `swc-loader`，缺少对 ESM 风格 `.js`→`.ts` 的扩展别名解析。

## 修复方案（推荐）
- 在 `apps/server/webpack.config.js` 增加 `resolve.extensions` 与 `resolve.extensionAlias`，让 webpack 将 `.js` 引用解析到 `.ts`，`.mjs` 解析到 `.mts`：
```
module.exports = {
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js', '.mjs'],
    extensionAlias: {
      '.js': ['.ts', '.js'],
      '.mjs': ['.mts', '.mjs'],
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: { loader: 'swc-loader', options: swcDefaultConfig },
      },
    ],
  },
}
```
- 该配置利用 webpack 5 的 `resolve.extensionAlias`，与 Prisma 7 的 ESM 生成方式兼容，无需改动任何生成代码。

## 备选方案
- 关闭 webpack 打包，仅使用 `swc`/`tsc` 编译：将 `nest-cli.json` 的 `compilerOptions.webpack` 设为 `false`，让 Nest 按源码编译到 `dist` 后以运行时解析路径。这会改变现有构建流程，不建议在已使用 webpack 的项目中切换。
- 不再自定义生成输出目录，直接从 `@prisma/client` 引用：改造路径别名 `#prisma`（当前见 `apps/server/tsconfig.json:25-27`）回到包默认入口。但这会影响全局类型与引用路径，除非有特殊需求不建议调整。

## 验证步骤
- 更新 `apps/server/webpack.config.js` 后，在 `apps/server` 下执行 `pnpm build`，确认不再出现 `Can't resolve` 报错，构建成功（webpack 5.103.0）。
- 如需本地快速验证，可执行 `pnpm dev:quick` 或 `pnpm start:dev`，确保运行时不受影响。

## 参考代码位置
- 触发错误的生成 import：`apps/server/prisma/generated/client.ts:18-22`
- 内部依赖的 `.js` 引用：`apps/server/prisma/generated/internal/class.ts:15-16`、`apps/server/prisma/generated/internal/prismaNamespace.ts:18-23`
- 现有 webpack 配置：`apps/server/webpack.config.js:6-20`
- TS 路径别名：`apps/server/tsconfig.json:25-27`