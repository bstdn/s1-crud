# S1 Crud

> S1 Crud 是一个基于 Vue.js 和 Element UI 的表格组件，封装了常用的表格操作

## 介绍
[S1-Crud](https://github.com/bstdn/s1-crud)是一套基于[Vue.js 2.2.0+](https://cn.vuejs.org/)和[Element UI 2.0.0+](http://element-cn.eleme.io/#/zh-CN)的表格组件。`S1-Crud` 将 `Element` 的功能进行了封装，并增加了表格的增删改查、数据校验、表格内编辑等常用的功能。大部分功能可由配置 `json` 实现，在实现并扩展了 `Element` 表格组件功能的同时，降低了开发难度，减少了代码量，大大简化了开发流程。

## 文档和示例
- 文档：
- 示例：

## 功能
- 继承了 Element 中表格所有功能
- 新增表格数据
- 修改表格数据
- 删除表格数据
- 使用 Element 中的组件渲染表格内容和表单内容
- 表单校验
- 表格内编辑
- 渲染自定义组件

## 安装
使用npm
``` bash
npm i element-ui @bstdn/s1-crud -S
```

使用yarn
``` bash
yarn add element-ui @bstdn/s1-crud
```

## 在项目中使用
在`main.js`中写入以下内容：
``` js
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import S1Crud from '@bstdn/s1-crud'

Vue.use(ElementUI)
Vue.use(S1Crud)

new Vue({
  el: '#app',
  render: h => h(App)
})
```

之后就可以在项目中使用`S1-Crud`了。
