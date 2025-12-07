module.exports = {
  '*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc,css}': [
    'biome check --write --no-errors-on-unmatched',
  ],
  '**/*.{ts,tsx}': (files) => {
    const normalize = (p) => p.replace(/\\/g, '/')
    const roots = Array.from(
      new Set(
        files
          .map(normalize)
          .map((f) => {
            const m = f.match(/^(apps|packages)\/[^/]+/)
            return m ? m[0] : null
          })
          .filter(Boolean),
      ),
    )
    return roots.map((dir) => {
      if (dir.endsWith('web-admin')) return `pnpm -C ${dir} run typecheck:fast`
      return `pnpm -C ${dir} run typecheck`
    })
  },
}
