const common = require('./common');
const k = '1234567890aa';
const p = '123456';
const pwdp = common.encryptByKey(p,k);
const pwd = common.decryptByKey(pwdp,k);//解密
const sha1Str = common.sha1(pwd);//sha1加密
console.log('加密后:',pwdp);
console.log('解密后:',pwd);
console.log('sha1后:',sha1Str);
