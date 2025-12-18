# NestJS Library 拆分重构方案

本以此文档记录将 `apps/server` 下的本地库 (`libs`) 拆分为 Monorepo 独立 npm 包 (`packages`) 的详细步骤。

## 目标
将 `apps/server/libs/redis` 和 `apps/server/libs/logger` 拆分为独立的 workspace 包，供 Monorepo 中其他应用共享。

- **Redis 包**: `packages/nest-redis` (包名: `@monorepo-demo/redis`)
- **Logger 包**: `packages/nest-logger` (包名: `@monorepo-demo/logger`)

## 步骤清单

### 1. 文件移动与目录结构调整
- [ ] 创建 `packages/nest-redis` 和 `packages/nest-logger` 目录。
- [ ] 将 `apps/server/libs/redis` 内容移动到 `packages/nest-redis`。
- [ ] 将 `apps/server/libs/logger` 内容移动到 `packages/nest-logger`。
- [ ] 删除 `apps/server/libs` 目录。
- [ ] 将新包中的 `tsconfig.lib.json` 重命名为 `tsconfig.json`。

### 2. 初始化包配置
为新包创建 `package.json` 并更新 `tsconfig.json`。

#### @monorepo-demo/redis
- 依赖: `@nestjs/common`, `@nestjs/core`, `ioredis`, `reflect-metadata`, `rxjs`
- 配置: 确保 `main`, `types` 指向正确构建产物。

#### @monorepo-demo/logger
- 依赖: `@nestjs/common`, `winston`, `reflect-metadata`, `rxjs`

### 3. 更新 Server 配置
修改 `apps/server` 的配置文件以适配新结构。

- **package.json**: 添加 `@monorepo-demo/redis` 和 `@monorepo-demo/logger` 到 `dependencies`。
- **tsconfig.json**:
    - 移除 `@app/redis`, `@lib` 等路径映射 (paths)。
    - 移除 `include` 中的 `libs`。
- **nest-cli.json**:
    - 移除 `monorepo: true`。
    - 移除 `projects` 下的 `redis` 和 `logger` 配置。

### 4. 代码重构 (Imports)
全局替换引用路径：

- `@app/redis` -> `@monorepo-demo/redis`
- `@lib` -> 根据具体使用的服务，分别替换为 `@monorepo-demo/redis` 或 `@monorepo-demo/logger`。
    - `RedisService`, `RedisModule` -> `@monorepo-demo/redis`
    - `GlobalLoggerService`, `GlobalLoggerModule` -> `@monorepo-demo/logger`

### 5. 验证
- 运行 `pnpm install` 链接 workspace 依赖。
- 运行 `pnpm --filter server build` 验证构建。
