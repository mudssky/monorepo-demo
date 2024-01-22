# prettier-config-custom

prettier的配置文件  
除了基本的配置，添加了

- `prettier-plugin-organize-imports` 用于格式化导入语句的排序
- `prettier-plugin-packagejson` 格式化package.json的字段排序

## Usage

安装这个包和prettier

```shell
pnpm add @mudssky/prettier-config-custom  prettier -D
```

在项目根目录创建`.prettierrc.cjs`文件，并引用配置

```js
const prettierConfigCustom = require('@mudssky/prettier-config-custom')

module.exports = prettierConfigCustom
```
