## 基于egg框架的工程开发规范

#### 1、符合《nodejs工程通用开发规范指南》里的约定
> - 《nodejs工程通用开发规范指南》[传送门](./nodejs.md)
> - Egg 奉行『约定优于配置』，按照一套统一的约定进行应用开发，团队内部采用这种方式可以减少开发人员的学习成本。没有约定的团队，沟通成本是非常高的，比如有人会按目录分栈而其他人按目录分功能，开发者认知不一致很容易犯错。
#### 2、目录结构规范
```
egg-project
├── package.json
├── app.js (可选)                 // 用于自定义启动时的初始化工作
├── agent.js (可选)               // 用于自定义启动时的初始化工作
├── app
|   ├── router.js                // 用于配置 URL 路由规则
│   ├── controller               // 用于解析用户的输入，处理后返回相应的结果
│   |   └── home.js
│   ├── model (可选)              // 用于放置领域模型
│   |   └── user.js
│   ├── service (可选)            // 用于编写业务逻辑层
│   |   └── user.js
│   ├── middleware (可选)         // 用于编写中间件
│   |   └── response_time.js
│   ├── schedule (可选)           // 用于定时任务
│   |   └── my_task.js
│   ├── public (可选)             // 用于放置静态资源
│   |   └── reset.css
│   ├── view (可选)               // 用于放置模板文件
│   |   └── home.tpl
│   └── extend (可选)             // 用于框架的扩展
│       ├── helper.js (可选)
│       ├── request.js (可选)
│       ├── response.js (可选)
│       ├── context.js (可选)
│       ├── application.js (可选)
│       └── agent.js (可选)
├── config
|   ├── plugin.js               // 用于配置需要加载的插件
|   ├── config.default.js       // 用于编写配置文件
│   ├── config.prod.js          // 生成环境配置文件
|   ├── config.test.js (可选)
|   ├── config.local.js (可选)
|   └── config.unittest.js (可选)
└── test                        // 用于单元测试
    ├── middleware
    |   └── response_time.test.js
    └── controller
        └── home.test.js
```
> 详情使用请在[egg官网](https://eggjs.org/zh-cn/intro/index.html)学习