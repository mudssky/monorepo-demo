## 问题原因
- 运行日志显示 Prisma 报错 `P1001 Can't reach database server at base`，发生在用户表初始化的 `prisma.user.count()`（apps/server/src/modules/auth/auth.service.ts:403）。
- 配置日志中 `DATABASE_URL` 带有包裹的引号：`"postgresql://..."`，并且多处环境变量同样保留了单/双引号（apps/server 启动日志）。Prisma 从 `process.env.DATABASE_URL` 直接读取连接串，包含引号会导致解析异常或连接失败。
- 当前开发环境加载顺序为 `.env.local` → `.env.development.local` → `.env.development`（apps/server/src/modules/global/global.module.ts:41-51）。其中某一层的变量可能仍保留引号或覆盖了 `DATABASE_URL`。

## 解决方案
1. 清理 `.env.development` 中的引号：所有字符串变量（尤其 `DATABASE_URL`、`MAIL_*`、`MINIO_*`、`GITHUB_*`、`GOOGLE_*` 等）去掉包裹的引号，保持纯净值。
2. 在环境变量映射类中为 `DATABASE_URL` 增加统一的值清洗，去除首尾引号与空白，避免不同文件或平台解析差异：
   - 位置：apps/server/src/common/config/config.ts（EnvironmentVariables）
   - 为 `DATABASE_URL` 添加 `@Transform(({ value }) => typeof value === 'string' ? value.trim().replace(/^['"]|['"]$/g, '') : value, { toClassOnly: true })`
3. 验证数据库可达：确认本地 PostgreSQL 正在 127.0.0.1:5432 运行、用户名密码与库名一致（nestAdmin）。如未运行，先启动数据库或修正连接串。

## 验证步骤
- 运行 `pnpm dev:quick` 或 `pnpm start:dev`，观察不再出现 `P1001` 报错。
- 如仍失败，打印 `process.env.DATABASE_URL`，确保不含任何引号或不可见字符；必要时将 `localhost` 改为 `127.0.0.1` 并重试。

## 代码参考
- 报错点：apps/server/src/modules/auth/auth.service.ts:403
- 配置加载：apps/server/src/modules/global/global.module.ts:41-51
- 环境变量类：apps/server/src/common/config/config.ts:31-75、146-162（为 `DATABASE_URL` 增加 Transform）