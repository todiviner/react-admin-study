# react-admin 后台管理
# 全局安装
npm install -g create-react-app
# 构建一个my-app的项目
npx create-react-app my-app
cd my-app


create-react-app my-app
# 启动编译当前的React项目，并自动打开 http://localhost:3000/
npm start

## 配置 antd 自动按需导入样式
- 导入包 `babel-plugin-import customize-cra react-app-rewired`
- 然后创建 `config-overrides.js` 文件
``` javascript
// 在config-overrides.js文件中配置 根据按需组件导入样式
const { override, fixBabelImports, addLessLoader } = require('customize-cra')

module.exports = override(
  // 针对antd实现按需打包：根据import来打包(使用babel-plugin-import)
  fixBabelImports('import', {
    "libraryName": "antd",
    "libraryDirectory": "es",
    "style": true // 自动打包相关的样式
  }),

  // 使用less-loader 对源码中less的变量进行重新指定
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {'@primary-color': '#1DA57A'}
  })
)
```
- 子组件调用父组件用函数调用
- 父组件调用子组件用this.createRef的ref调用
- 使用了 react-draft-wysiwyg 富文本编辑器

## 生成远程dev
- git checkout -b dev origin/dev
