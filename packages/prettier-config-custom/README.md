# prettier-config-custom

prettier的配置文件  

除了该配置文件，还可以引入其他插件增强体验

- `prettier-plugin-organize-imports` 用于格式化导入语句的排序
- `prettier-plugin-packagejson` 格式化package.json的字段排序  
  
如果使用tailwind

- `prettier-plugin-tailwindcss` 格式化tailwind的类名

## Usage

安装这个包和prettier

```shell
pnpm add @mudssky/prettier-config-custom  prettier -D
```

安装其他插件

```shell
pnpm add prettier-plugin-organize-imports prettier-plugin-packagejson -D
pnpm add prettier-plugin-tailwindcss -D
```

在项目根目录创建`.prettierrc.cjs`文件，并引用配置

```js
const prettierConfigCustom = require('@mudssky/prettier-config-custom')

module.exports = {
 ...prettierConfigCustom,
   plugins: [
    'prettier-plugin-tailwindcss',
    'prettier-plugin-organize-imports',
    'prettier-plugin-packagejson',
  ],
}
```
