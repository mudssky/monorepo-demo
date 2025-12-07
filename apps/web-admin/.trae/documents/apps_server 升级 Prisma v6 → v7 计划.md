## 检测结论

- 包管理器：`pnpm`（server `package.json` 大量脚本使用 `pnpm`，apps/server/package.json:13、14、18、22、31 等）。
- 当前 Prisma 版本：`prisma@6.5.0`、`#prisma@6.5.0`（apps/server/package.json:72、92）。
- 数据库：PostgreSQL（apps/server/.env.development:4 的 `DATABASE_URL` 为 `postgresql://...`）。
- Accelerate：未检测到（代码与依赖中未发现 `withAccelerate`、`@prisma/extension-accelerate`、`PRISMA_ACCELERATE_*` 等）。
- 现有 `prisma.config.ts`：使用 v6 风格（apps/server/prisma.config.ts:4-9），仅设置 `schema` 指向目录与 `seed`，未集中管理 `datasource.url`。
- 客户端引入方式：服务端直接从 `#prisma` 导入并实例化（apps/server/src/modules/prisma/prisma.service.ts:2、5-22）。

结论消息：

- 未检测到 Accelerate → 推荐采用 v7 的 Direct TCP + 数据库适配器。

## 迁移目标

- 升级到 Prisma ORM v7（CLI 与 Client）。
- 采用 Direct TCP + PostgreSQL 适配器，统一用 `dotenv` 加载环境，保持 ESM 兼容。
- 将连接 URL 从 `schema.prisma` 的 `datasource` 中移除，改由 `prisma.config.ts` 管理。
- 保持现有业务逻辑与 API 不变，最小化改动。

## 变更步骤

### 1) 依赖升级

- 在 `apps/server` 内升级/安装：
  - 运行时：`#prisma@latest`、`@prisma/adapter-pg`、`pg`。
  - 开发：`prisma@latest`、`tsx`（已使用 `tsx`，版本可统一）、`@types/pg`。
- 保留 `dotenv`（apps/server/package.json:81 已存在）。
- 说明：文档推荐 PostgreSQL 使用 `@prisma/adapter-pg`（Prisma 官方文档）。

### 2) Prisma Schema 更新

- 在 `apps/server/prisma` 目录内的主 schema 文件：
  - 将 `generator client`：
    - `provider` 改为 `"prisma-client"`。
    - 不显式设置 `output`，以减少对现有 `#prisma` 引用的破坏（保持导入路径稳定）。
  - 移除 `previewFeatures = ["driverAdapters"]`、`engineType` 等历史字段（若存在）。
  - 在 `datasource db`：保留现有 `provider = "postgresql"`，删除 `url = ...` 行，保留其他属性（如 `shadowDatabaseUrl`、`relationMode` 等）。
- 备注：现工程 `schema` 以目录形式组织；若主入口文件名为 `schema.prisma`，则按该文件变更；否则在入口文件中做等效修改。

### 3) 迁移到 v7 的 `prisma.config.ts`

- 用 v7 风格替换 `apps/server/prisma.config.ts`：
  - 使用 `import 'dotenv/config'`、`defineConfig` 与 `env`。
  - 明确 `schema: 'prisma/schema.prisma'`（将目录入口统一到主文件）。
  - `migrations.path: 'prisma/migrations'`。
  - `datasource.url: env('DATABASE_URL')`。
  - 保留 `seed: 'tsx prisma/seed.ts'`。

### 4) ESM 与 TS 基线

- `package.json`：添加/确认 `"type": "module"`；补充通用脚本：
  - `"generate": "prisma generate"`（已有 apps/server/package.json:26）。
  - `"migrate": "prisma migrate dev"`（已有等效脚本 apps/server/package.json:28）。
- `tsconfig.json`：确保与 ESM 兼容（`module: ESNext`、`moduleResolution: Node`、`target: ES2023`、`esModuleInterop: true`）。当前继承自自定义 preset（apps/server/tsconfig.json:2），将按最小改动补齐必要选项。

### 5) 客户端构造与导入

- 在 `apps/server/src/modules/prisma/prisma.service.ts`：
  - 顶部添加 `import 'dotenv/config'`。
  - 使用 `PrismaPg` 适配器：
    - `const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })`
    - `super({ adapter, omit: { ... }, log: [...] })`
  - 保留现有的 `omit` 与 `log` 设置。
- 其他业务文件中，如存在 `#prisma` 的类型导入（例如 apps/server/src/modules/user/user.service.ts:6），保持不变（因我们不强制修改生成输出路径）。

### 6) Seed 脚本

- 在 `apps/server/prisma/seed.ts`：
  - 使用 `dotenv/config` 与 `@prisma/adapter-pg`，与运行时保持一致：
    - `const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })`
    - `const prisma = new PrismaClient({ adapter })`
  - 写入初始数据（按现有业务要求）。

### 7) 中间件 → 扩展

- 若项目存在 `prisma.$use` 中间件，提示 v7 已移除此 API，建议迁移到扩展（当前未检测到 `$use`）。

### 8) Accelerate 信息

- 未检测到 Accelerate：
  - 直接输出提示：`Direct TCP 是 v7 的默认推荐；除非需要缓存，否则建议采用数据库适配器。`

### 9) 脚本与 CI

- 验证/对齐脚本：
  - `generate`: `prisma generate`
  - `migrate`: `prisma migrate dev`
  - `dev/start`: 保证 ESM 生效并在应用入口尽早 `dotenv/config`。
- CI 要求：Node ≥ 20.19、TypeScript ≥ 5.4。

### 10) 运行与验证

- 在 `apps/server`：
  1. `pnpm prisma:generate` → 成功生成客户端。
  2. `pnpm prisma:migrate-dev` → 通过 `DATABASE_URL` 直连运行迁移。
  3. `pnpm tsx prisma/seed.ts` → 完成数据插入。
  4. 启动应用：Nest 正常实例化 PrismaClient with adapter；常规查询可用。
  5. 若出现 P1017/连接异常：检查 `DATABASE_URL` 与 `import 'dotenv/config'` 是否最先执行。
  6. 若出现模块解析问题：检查 `"type": "module"` 与客户端重新生成。

## 变更摘要（提交说明）

- 依赖升级：`prisma` / `#prisma` → v7；新增 `@prisma/adapter-pg`、`pg`（及 `@types/pg`）。
- Schema：`generator provider` → `prisma-client`；移除 `datasource.url`；保留 `provider = "postgresql"`。
- 新版 `prisma.config.ts`：集中 `datasource.url` 与迁移与 seed 配置。
- 运行时重构：统一使用 Direct TCP + Adapter，保留现有日志与 omit 设置。
- ESM/TS 配置：确保与 v7 兼容。
- Seed 脚本：对齐适配器与 `dotenv` 的用法。
- 未检测到 Accelerate；未触及其代码路径，仅输出推荐信息。

## 备注与取舍

- 关于适配器选择：结合官方文档与本地 PostgreSQL 场景，采用 `@prisma/adapter-pg` 更为稳妥；若后续使用 Prisma Postgres 托管服务，可改为 `@prisma/adapter-ppg`。
- 为尽量减少对现有大量 `#prisma` 类型导入的影响，本计划不强制改动生成输出路径；一旦需要迁移到自定义输出（如 `./generated`），可增补 `tsconfig` 路径映射与运行时别名再进行批量替换。
