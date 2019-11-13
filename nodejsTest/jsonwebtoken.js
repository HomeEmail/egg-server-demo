const jwt = require('jsonwebtoken');
//签名
// let token = jwt.sign({
//   name:'pandaImageViewer'
// },'secretKey',{ expiresIn: '1h',issuer:'591694604@qq.com',audience:'to-user@ff.com',subject:'user regcode' });
const secretKey = 'aaddbd';
let token = jwt.sign({
  name:'pandaImageViewer'
},secretKey,{issuer:'591694604@qq.com',audience:'to@qq.com',subject:'user regcode' });
console.log('token',token);
//验证
let decoded = jwt.verify(token, secretKey);
console.log('decoded',decoded);