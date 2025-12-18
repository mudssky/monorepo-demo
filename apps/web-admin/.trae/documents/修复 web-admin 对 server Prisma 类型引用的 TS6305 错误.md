## 问题原因
- 触发点在 `src/api/upload/upload.ts:1`：`import type { $Enums } from '@server/prisma/generated/client'`
- `apps/web-admin/tsconfig.json` 中同时存在：
  - `paths`: `"@server/*" -> "../server/*"`
  - `exclude`: 排除了 `"../server/"`
  - `references`: 指向 `"../server/tsconfig.json"`
- 这是一种 TypeScript Project References 用法：被引用工程（server）需要先构建生成 `.d.ts` 到其 `outDir`（通常为 `dist`）。未构建时，类型检查会报 TS6305：找不到从源 `../server/prisma/generated/client.ts` 构建出的 `dist/prisma/generated/client.d.ts`。

## 方案一：保持工程引用，先构建 server（推荐）
- 步骤：
  - 在 `apps/server` 生成 Prisma Client（如使用）：`pnpm --filter @server prisma generate`
  - 构建 server：`pnpm --filter @server build` 或在工作区根：`pnpm -w -r --filter @server build`
  - 再在 `apps/web-admin` 执行类型检查：`pnpm typecheck:fast`
  - 可优化脚本：将 `typecheck:fast` 改为先构建 `@server` 再运行 `tsgo --noEmit`
- 优点：遵循当前 Project References 设计，类型源自后端真实 schema，稳定可靠。
- 缺点：需要先行构建，CI/本地流程需串联。

## 方案二：改为消费构建产物路径
- 调整 web-admin 的 `tsconfig.json`：将 `"@server/*"` 指向 `"../server/dist/*"`（或新增 `@server-dist/*` 别名）。
- 在 `src/api/upload/upload.ts` 改为导入 `@server/dist/prisma/generated/client`。
- 仍需确保 `apps/server` 先构建（否则 `dist` 不存在）。
- 优点：显式消费 `.d.ts` 构建产物，避免 TS6305 指向源-产物不一致。
- 缺点：与构建强耦合，开发时未构建会报同样问题。

## 方案三：去耦合为共享或本地类型
- 抽取枚举为共享包（如 `@shared/types`），前后端共同依赖；在 web-admin 使用共享的 `FileTag` 类型。
- 或在 web-admin 定义本地 `FileTag`（枚举或字面量联合），将 `UploadSingleParam.fileTag: $Enums.FileTag` 改为本地类型。
- 优点：前端与后端生成物解耦，typecheck 不再依赖 server 构建。
- 缺点：需要维护共享类型与后端 Prisma 枚举一致；可能降低严格性。

## 方案四：使用 `@prisma/client` 的类型
- 在 web-admin 安装 dev 依赖：`pnpm add -D @prisma/client`
- 修改导入：`import type { $Enums } from '#prisma/client'`
- 注意：`@prisma/client` 的具体枚举类型来自 `prisma generate`，若前端项目没有对应 schema 或未生成，枚举可能不完整。
- 优点：不再跨包引用 server。
- 缺点：仍可能需要生成，且前端不应在运行时依赖 Prisma 客户端。

## 推荐执行路径
- 首选方案一：对齐现有 Project References，保证类型与后端保持一致。
- 若短期只需消除错误且不依赖后端构建，采用方案三作为临时去耦合，后续再回归方案一。

## 验证
- 构建 `@server` 后在 `apps/web-admin` 运行：`pnpm typecheck:fast`，确认 TS6305 消失。
- 检查 `src/api/upload/upload.ts:1` 类型解析正常，`UploadSingleParam.fileTag` 类型可用。

请确认采用哪条方案，我将据此进行具体修改（脚本调整或类型替换），并完成验证。