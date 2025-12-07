## 目标
在 monorepo 根的 `lint-staged` 中，根据改动文件所属的子项目（如 `apps/<name>`、`packages/<name>`）触发对应子项目的类型检查（可为严格 `tsc --noEmit` 或快速 `tsgo --noEmit`）。

## 原有现状
- 格式化使用 `biome`（保留）。
- 统一类型检查使用 `tsgo --noEmit`（需要按项目拆分）。
- `apps/web-admin` 已有脚本：`typecheck` 与 `typecheck:fast`（apps/web-admin/package.json:15-16）。

## 技术方案
1. 在 `lint-staged.config.js` 使用函数动态生成命令，按文件路径归组到项目根：`apps/<name>` 或 `packages/<name>`。
2. 路由到不同项目的脚本：
   - `web-admin` 使用快速 `typecheck:fast`（`tsgo`）。
   - 其他项目默认使用严格 `typecheck`（`tsc --noEmit`）。
3. 兼容 Windows 路径：在函数中将反斜杠统一替换为 `/` 再匹配。
4. 可选：若更偏好 Turborepo 调度，改为返回 `turbo run typecheck --filter=./apps/<name>`。

## 配置示例（保留 biome，新增按项目类型检查）
```js
module.exports = {
  '*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc,css}': [
    'biome check --write --no-errors-on-unmatched',
  ],
  '**/*.{ts,tsx}': (files) => {
    const normalize = (p) => p.replace(/\\/g, '/');
    const roots = Array.from(new Set(
      files
        .map(normalize)
        .map((f) => {
          const m = f.match(/^(apps|packages)\/[^/]+/);
          return m ? m[0] : null;
        })
        .filter(Boolean),
    ));
    return roots.map((dir) => {
      if (dir.endsWith('web-admin')) return `pnpm -C ${dir} run typecheck:fast`;
      return `pnpm -C ${dir} run typecheck`;
    });
  },
};
```

## 验证步骤
1. 在任一子项目中暂存 TS 文件改动；
2. 运行 `pnpm dlx lint-staged` 或触发 pre-commit；
3. 观察只执行所属子项目的类型检查脚本；
4. 对不同项目分别改动，确认命令按项目去重、并行执行正常。

## 备选实现
- 不使用脚本，直接 `tsc -p <project>/tsconfig.json --noEmit`；
- 使用 `turbo run typecheck --filter=./apps/<name>` 路由到每个改动项目。

## 变更范围
- 仅修改根文件 `lint-staged.config.js`（d:\coding\Projects\frontend\monorepo-demo\lint-staged.config.js:1）。
- 如其他项目缺少 `typecheck`/`typecheck:fast`，为其在各自 `package.json` 补充脚本。