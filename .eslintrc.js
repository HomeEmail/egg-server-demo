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