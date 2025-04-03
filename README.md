# Monorepo demo

## changeset

### add changeset to a new project

```
pnpm add @changesets/cli -D && pnpm changeset init
```

### Adding changesets

```
pnpm changeset
```

or

```
npx @changesets/cli
```

### Versioning and publishing

```
pnpm changeset version
```

or

```
npx @changesets/cli version
```

then add a git commit

```
git add .
git commit
git push
```

publish

```
pnpm changeset publish
```

or

```
npx @changesets/cli publish
```
