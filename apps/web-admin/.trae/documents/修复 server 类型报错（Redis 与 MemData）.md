## 现状评估

* 配置类型：Flat Config（`eslint.config.js`），未使用 `.eslintrc.*`，结构已符合新版 ESLint 要求（apps/web-admin/eslint.config.js:8-35）。

* Lint 脚本：`pnpm lint` / `pnpm lint:fix`（apps/web-admin/package.json:12-13）。

* 当前版本：`eslint@^9.33.0`、`@eslint/js@^9.25.1`、`typescript-eslint@^8.39.0`、`eslint-plugin-react@^7.37.5`、`eslint-plugin-react-hooks@^5.2.0`、`globals@^16.0.0`（apps/web-admin/package.json:50-75）。

* 最新稳定版参考：ESLint v9.39.1（GitHub Releases）、`@eslint/js@9.39.1`（npm），`typescript-eslint@8.48.1`（GitHub Releases）。

## 升级目标

* 将 apps/web-admin 的 ESLint 相关依赖统一升级到最新稳定版：

  * `eslint@^9.39.1`

  * `@eslint/js@^9.39.1`

  * `typescript-eslint@^8.48.1`

  * `eslint-plugin-react@latest`

  * `eslint-plugin-react-hooks@latest`

  * `globals@latest`

* 暂不升级到 ESLint v10（当前为预发布，Node 要求更高并含破坏性变更），如需尝鲜可另行确认。

## 兼容性与注意事项

* Node 要求：ESLint v9 需 `Node ^18.18.0 || ^20.9.0 || >=21.1.0`（npm 页面）。若 Node 版本较低需先升级。

* 我们已经使用 Flat Config（`eslint.config.js`），与 v9/v10 的方向一致；升级后配置无需结构性改动，仅可能出现规则集更新导致的新增告警。

* Prettier：项目使用独立 Prettier 及 `prettier-plugin-tailwindcss`，无需 `eslint-plugin-prettier`。若遇到样式类规则冲突，可考虑引入 `eslint-config-prettier` 作为补充。

## 操作步骤

* 方式 A（直接更新依赖）：

  * 在 `apps/web-admin` 目录执行：

    * `pnpm up -D eslint@^9.39.1 @eslint/js@^9.39.1 typescript-eslint@^8.48.1 eslint-plugin-react@latest eslint-plugin-react-hooks@latest globals@latest`

* 方式 B（编辑 package.json 后安装）：

  * 将上述版本号写入 `devDependencies`，执行 `pnpm i`。

* 运行与验证：

  * `pnpm typecheck`

  * `pnpm lint`（观察新增告警）

  * `pnpm lint:fix`（自动修复可修复项）

  * 如仍有少量规则差异，再在 `eslint.config.js` 中按需微调。

## 验证标准

* `pnpm lint` 退出码为 0，且无新增高风险告警。

* 主要页面与构建流程（`pnpm build`）正常。

## 可选增强

* 在工作区根目录建议配置 `.npmrc`：`auto-install-peers=true`、`node-linker=hoisted`，以提升与 pnpm 的兼容性（ESLint 文档建议）。

* 待 v10 稳定后可评估升级：v10 移除 eslintrc 支持、提高 Node 要求；我们当前使用 Flat Config，迁移成本较低。

## 参考

* ESLint npm（最新与 Node 要求）：<https://www.npmjs.com/package/eslint>

* ESLint Releases（v9.39.1 / v10 预览）：<https://github.com/eslint/eslint/releases>

* @eslint/js npm：<https://www.npmjs.com/package/@eslint/js>

* typescript-eslint Releases：<https://github.com/typescript-eslint/typescript-eslint/releases>

