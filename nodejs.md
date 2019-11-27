## nodejs工程通用开发规范指南

#### 1. 工程必须有文件目录结构规范说明
> 说明清楚此工程的文件命名规则，如驼峰命名或者下划线命名

目录结构说明例如：
```js
// readme.rd文件
// 使用mddir生成工程目录
|-- projectName
    |-- test      // 单元测试
    |-- .gitignore
    |-- config.js // 配置文件
```

#### 2. 工程必须配置eslint进行代码检查
>  在提交git前必须检查通过，否则不允许提交
##### 2.1 eslint配置和规则参考：
> 规则原则上不变，视具体项目改进。详细查询[eslint官网](https://eslint.org/docs/user-guide/getting-started)
```
// .eslintignore文件
node_modules/
test/
apidoc/
public/
```
```
// .eslintrc.js文件
module.exports = {
  "root": true,
  "env": {
    "browser": false,
    "node": true
  },
  extends: 'eslint-config-egg',
  // for experimental features support
  parser: 'babel-eslint',
  parserOptions: {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
    }
  },
  rules: {
    // see https://github.com/eslint/eslint/issues/6274
    // 允许使用async
    'generator-star-spacing': 'off',
    'babel/generator-star-spacing': 'off',
    "indent": ["error", "tab"],//使用tab缩进 2个空格
    // 三等号
    'eqeqeq': 0,
    // 强制在注释中 // 或 /* 使用一致的空格
    // 'spaced-comment': 0,
    // 关键字后面使用一致的空格
    'keyword-spacing': 0,
    // 强制在 function的左括号之前使用一致的空格
    'space-before-function-paren': 0,
    // 引号类型
    "quotes": [1, "single"],
    // 要求或禁止末尾逗号
    'comma-dangle': 1,
    // js语句结尾必须使用分号
    'semi': [2, 'always'],
    'no-console': 'off', // process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'linebreak-style': [0, 'error', 'windows'], // 换行符允许windows开发环境
    'no-trailing-whitespace': false,
    'padded-blocks': ['error', 'never'],
    'no-unused-vars': 0, // 声明但未使用的变量，不要报错了
    // 禁止出现未使用过的变量
    //'no-unused-vars': 1,
    'eol-last': 0, // not need Newline required at end of file
    'comma-dangle': 0,
    'padded-blocks': 0,
    'no-multiple-empty-lines': 0,
    'no-else-return': 0,
    'no-extra-boolean-cast': 0,
    'no-trailing-spaces': 0,
    'jsdoc/check-tag-names': 0,
    'block-spacing': 0,
    'dot-notation': 0,
    'prefer-promise-reject-errors': 0,
  }
};
```
##### 2.2 package.json配置参考：
> 此配置是基于egg框架的配置，具体项目请相应改变，上eslint官网查询
```json
"scripts": {
  "lint": "npx eslint app",
},
"devDependencies": {
  "babel-eslint": "8",
  "eslint": "4",
  "eslint-config-egg": "7",
  "pre-commit": "^1.2.2",
},
"pre-commit": [
  "lint"
]
```

#### 3. 代码书写约束
- 使用tab缩进（2空格距离）
> 请根据自己的编辑器设置好
- 语句结尾必须使用分号
- 使用单引号
```js
let str = 'hello world';
```
- 变量、属性和函数名都采用小驼峰
```js
let adminUser = this.ctx.query(1);
```
- 类名采用大驼峰
```js
class LoginKeyController extends Controller {

}
function AccountController() {

}
```
- 用大写来标识常量
- 写精简的函数
> 尽可能的保持你的函数尽可能的精简。 一个好的函数应该能够在幻灯片上一屏显示。
- 尽早的从函数中返回
> 为了避免深入嵌套的 if 语句，请尽早的从函数中返回
```js
function isPercentage(val) {
  if (val < 0) {
    return false;
  }
  if (val > 100) {
    return false;
  }
  return true;
}
```
- 使用async/await特性避免嵌套太多回调

- 配置api文档生成
> 比如使用apidoc或者swagger