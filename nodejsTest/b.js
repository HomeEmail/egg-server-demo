let path = require('path');

const A = require('./a.js');
console.log('b',A);
//console.log('NODE_ENV',process.env);
console.log('NODE_ENV PATH:',process.env.PATH);//系统环境变量path
console.log('process.argv:',process.argv); //命令行输入的命令，['node','b.js','param1','param2']

console.log('__dirname:', __dirname); // 文件夹
console.log('__filename:', __filename); // 文件

console.log('path.join:',path.join(__dirname, 'views', 'view.html')); // 如果不希望自己手动处理 / 的问题，使用 path.join
