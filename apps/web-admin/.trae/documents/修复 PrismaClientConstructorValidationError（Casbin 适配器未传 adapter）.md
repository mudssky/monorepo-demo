## 根因说明
- 报错含义：当 Prisma 客户端的 `engineType` 为 `client` 时，构造 `PrismaClient` 必须提供 `adapter` 或 `accelerateUrl`，否则抛出 `PrismaClientConstructorValidationError`。
- 现状：`PrismaService` 已正确传入 `adapter`（`@prisma/adapter-pg`）。见 `apps/server/src/modules/prisma/prisma.service.ts:10-28`。
- 真正触发点：`casbin-prisma-adapter` 在内部调用 `new PrismaClient({})`（空配置），未传 `adapter`，与 `engineType=client` 不兼容。证据：`node_modules/casbin-prisma-adapter/lib/adapter.js:43-50, 81-88` 和 `:210-213`。
- 结论：并非 `prisma.service.ts` 本身的问题，而是 Casbin 的 Prisma 适配器实例化方式不符合 Prisma v7 的 `client` 引擎要求。

## 具体修复方案
1. 在 Casbin 集成处，改为向 `PrismaAdapter` 传入“已配置好 adapter 的 PrismaClient 实例”。
   - 代码思路：从 Nest 注入的 `PrismaService` 获取实例，传入 `PrismaAdapter.newAdapter(prismaService)`。
   - 这样适配器内部将直接使用我们带 `adapter` 的客户端，不会再调用 `new PrismaClient({})`。
2. 或者：向 `PrismaAdapter.newAdapter` 传入 `PrismaClientOptions`，其中包含 `adapter: new PrismaPg({ connectionString: resolveDatabaseURL(process.env.DATABASE_URL) })`。
   - 该方式也满足 `engineType=client` 的校验。
3. 备选兜底：如果短期无法调整 Casbin 集成，可将 Prisma 客户端的引擎切回 `binary`（在 `generator client { engineType = "binary" }` 或设置环境变量），以暂时不需要 `adapter/accelerateUrl`。
   - 注意：这会绕过驱动适配器路径，需评估与现有 `adapter-pg` 的使用是否冲突。

## 预计改动点
- Casbin 初始化/注入位置（例如鉴权模块或全局中间件）里创建 `PrismaAdapter` 的代码。
- 保持 `PrismaService` 不变，继续统一管理数据库连接与 `omit` 配置：`apps/server/src/modules/prisma/prisma.service.ts:9-32`。

## 验证步骤
- 启动服务，访问任意路由（比如 `GET /system-monitor/getMem`）。
- 观察日志不再出现 `PrismaClientConstructorValidationError`。
- 验证 Casbin 的权限读写（`loadPolicy`/`savePolicy`/`createMany` 等）正常工作。

## 风险与注意
- 确保 `DATABASE_URL` 有效且 `resolveDatabaseURL(...)` 返回正确字符串。
- 如果使用不同数据库驱动，选择对应的 Prisma Adapter（如 `@prisma/adapter-node-postgres`）。
- 若采用兜底方案切回 `binary`，需统一全局，不要一处使用 adapter、另一处使用 binary，避免行为不一致。