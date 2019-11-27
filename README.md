# egg-server-demo样例工程

## 规范说明
符合参考研发部[开发规范](http://gitlab.uniin.cn/spec/dev/tree/nodejs/nodejs)《nodejs工程通用开发规范指南》 和 《基于egg框架的工程开发规范》
## 集成特性
- 鉴权逻辑
- 路径缓存逻辑
- 数据查询封装
- 上传文件逻辑
- redis缓存

## 使用说明
### 命令脚本
- 调试开发
  > npm run debug

- chrome打开
  > chrome://inspect
  添加配置
  localhost:9999
  点击DevTools for Node

- 开发运行
  > npm run dev

- 测试
  > npm run test

- 测试覆盖测试
  > npm run cov

- 生成api文档
  > npm run apidoc
  文档访问
  http://127.0.0.1:7001/apidoc/index.html


### 工具库说明
  > 工具库使用样例,在`common`文件夹或者`nodejsTest`文件夹下

- egg框架
  https://github.com/eggjs/

- mz是个封装nodejs自带api，可以使用promise或者async特性写代码
- stream-wormhole	将 stream 流消耗掉
- await-stream-ready	文件读写流 ready 库，能够使用 await
- Moment 是一个日期时间处理库 a Parse, validate, manipulate, and display dates and times in JavaScript.
- ms 时间转换成毫秒 Tiny milisecond conversion utility https://npmjs.com/ms
- egg-session-redis 就提供了将 Session 存储到 redis 中的能力，在应用层，我们只需要引入 egg-redis 和 egg-session-redis 插件
- egg-validate 验证规则 https://github.com/node-modules/parameter
- ftp ftp操作
- xml2js xml格式转js对象
- log4js 日记操作
- exceljs和ejsexcel 表格文件操作
- crypto 加密操作
- jsonwebtoken jwt操作
- 还有加密、uuid、短字符、数据库查询等等
### 上线部署
部署环境
Node 版本为 >= 8.0.0

应用部署
1.构建
```shell
$ cd baseDir
$ npm install --production
$ tar -zcvf ../release.tgz .
```
2.执行
复制压缩包到部署目录解压压缩包
在部署目录，终端执行 `npm start` 启动应用，`npm stop` 停止应用
也可以直接通过 `ps -eo "pid,command" | grep -- "--title=egg-server"` 来找到 master 进程，并 kill 掉，无需 kill -9。

默认是按cpu核数来启动服务的，项目配置文件默认在/config/config.default.js里

默认输出日记在登陆系统的当前用户目录下的logs文件夹里
所有日志文件默认都放在 `${appInfo.root}/logs/${appInfo.name}` 路径下，例如 `/home/admin/logs/example-app`。
在本地开发环境 (env: local) 和单元测试环境 (env: unittest)，为了避免冲突以及集中管理，日志会打印在项目目录下的 logs 目录，例如 /path/to/example-app/logs/example-app。
如果想自定义日志路径：
```js
// config/config.${env}.js
exports.logger = {
  dir: '/path/to/your/custom/log/dir',
};
```
### 安装依赖错误
- 安装依赖提示这个错误：if not defined npm_config_node_gyp
解决：
参考：https://github.com/nodejs/node-gyp
找到node-gyp.js路径
配置路径，比如：
  > set npm_config_node_gyp=C:\Program Files\nodejs\node_modules\npm\node_modules\node-gyp\lib\node-gyp.js

- 依赖安装不了，使用nrm切换依赖源，
  百度nrm怎么用就行
  或者
  执行npm时加上--unsafe-perm=true --allow-root,如：
  ```shell
  npm install --unsafe-perm=true --allow-root
  ```
