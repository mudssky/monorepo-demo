# `@mudssky/eslint-config-custom`

eslint配置文件的集合

## Usage

需要先安装eslint

```shell
pnpm add eslint @mudssky/eslint-config-custom -D
```

然后，在项目的根目录下创建一个`.eslintrc.cjs`文件，并添加以下内容：

```js
module.exports = {
  extends: ['@mudssky/eslint-config-custom/vite-recommended'],
}

```

其中 vite-recommended 也可以换成根目录下的其他配置文件
