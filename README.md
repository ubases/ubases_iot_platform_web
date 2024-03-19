### 前端开发接入流程介绍（WEB端）

爱星物联WEB端前端项目技术栈基于Ant Design Pro of vue、 ES2015+、Vue.Js、Vuex、Vue-Router、g2 和 antd-vue，提前了解和学习这些知识会非常有帮助。

#### 1. 环境准备
 - Node.js安装及环境配置。 [Node.js官网](https://nodejs.org/zh-cn/)
 - Git 安装。[git官网](https://git-scm.com/)

#### 2. 编辑器准备
 - 前端编辑器。推荐Visual Studio Code [vscode官网](https://code.visualstudio.com/)

#### 3. 安装
从 GitHub 仓库中直接安装最新的代码
```
$ git clone 项目地址
$ cd 项目名
```

#### 4. 本地开发
 - 安装依赖。
```
$ npm install
```
如果网络状况不佳，可以使用 cnpm 进行加速，并使用 cnpm 代替 npm

 - 启动项目。
```
$ npm run serve
```
启动完成后，打开浏览器访问 http://localhost:8000，即可看到本地项目的页面。 


#### 5. 项目目录结构简介

```
iot-platform-web
├─ babel.config.js                    # Babel的配置文件
├─ config                             # 主题配置
├─ jsconfig.json                      # 项目目录配置
├─ package.json                       # 项目配置项与依赖
├─ postcss.config.js                  # CSS转换配置
├─ public
│  ├─ index.html                      # Vue 入口模板
│  └─ logo.png                        # LOGO
├─ README.md
├─ src
│  ├─ api                             # Api ajax 等
│  ├─ App.vue                         # Vue 模板入口
│  ├─ assets                          # 本地静态资源
│  ├─ components                      # 业务通用组件
│  ├─ config                          # 项目基础配置
│  │  ├─ defaultSettings.js           # 全局设置
│  │  └─ router.config.js             # 路由配置
│  ├─ core                            # 项目引导
│  │  ├─ bootstrap.js                 # 全局配置初始化
│  │  ├─ directives                   # 指令
│  │  ├─ icons.js                     # svg图标引入文件
│  │  └─ lazy_use.js                  # 依赖包引入
│  ├─ global.less                     # 全局样式
│  ├─ layouts                         # 布局文件
│  ├─ locales                         # 国际化资源
│  ├─ main.js                         # Vue 入口 JS
│  ├─ mixins                          # 混入文件
│  ├─ mock                            # mock接口
│  ├─ permission.js                   # 路由守卫(路由权限控制)
│  ├─ router                          # Vue-Router
│  │  ├─ generator-routers.js         # 生成路由
│  │  └─ index.js                     # 路由初始化
│  ├─ store                           # Vuex
│  ├─ utils                           # 工具库
│  └─ views                           # 业务页面入口和常用模板  
│     ├─ aithings                     # 权限模块
│     ├─ authority                    # 权限模块
│     ├─ dataCenter                   # 数据管理
│     ├─ log                          # 日志模块
│     ├─ multiLanguage                # 多语言模块
│     ├─ exception                    # 其他
│     ├─ oemApp                       # APP模块
│     ├─ product                      # 产品开发模块
│     ├─ system                       # 系统管理模块
│     ├─ template                     # 模板管理模块
│     └─ user                         # 用户模块
└─ vue.config.js                      # 环境配置文件

```
