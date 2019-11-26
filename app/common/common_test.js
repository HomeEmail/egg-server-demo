// jshashes 加密库测试

/* const Hashes = require('jshashes');// 加密库

const string1= '123456';
const signature=new Hashes.SHA1().hex(string1);// 
console.log('sha1:'+ signature);
console.log('sha1 b64:'+ new Hashes.SHA1().b64(string1));
console.log('sha1 bb:'+ new Hashes.SHA1().hex('MTIzNDU2'));

console.log('SHA256:'+ new Hashes.SHA256().hex(string1));
console.log('SHA512:'+ new Hashes.SHA512().hex(string1));

// const MD5 = new Hashes.MD5;

console.log('MD5:'+ new Hashes.MD5().hex(string1));

*/
const path = require('path');

const common = require('./common');

console.log('sha1:' + common.sha1('123456'));
console.log('sha1ByCryptoJS:' + common.sha1ByCryptoJS('123456'));
console.log('sha256:' + common.sha256('123456'));
console.log('sha512:' + common.sha512('123456'));
console.log('md5:' + common.md5('123456'));
console.log('md5ByCryptoJS:' + common.md5ByCryptoJS('123456'));
console.log('sha1_b64:' + common.sha1_b64('123456'));

console.log('uuidv1:' + common.uuidv1());
console.log('uuidv4:' + common.uuidv4());
console.log('uuidv5:' + common.uuidv5('12345'));
console.log('uuidv5 dns:' + common.uuidv5('12345', 'DNS'));
console.log('uuidv5 url:' + common.uuidv5('12345', 'URL'));

console.log('base64 encode:' + common.b64_encode('JavaScript'));
console.log('base64 decode:' + common.b64_decode('SmF2YVNjcmlwdA=='));

console.log('__dirname:' + __dirname);
console.log('path.resolve:' + path.resolve('./'));//  当前执行node命令时所处的目录路径

const projectPath = path.resolve('../');// 不带/的
console.log('path.resolve(\'../\')', projectPath);

//  const img_base64_str=common.img2b64(projectPath+'/server/public/images/test2.png');
//  console.log('img_base64_str:'+img_base64_str);
//  console.log('---------------img_base64_str end----------------');
//  common.b642img(img_base64_str,projectPath+'/server/upload/test-2.png');

// http:// www.cnblogs.com/nano/archive/2013/05/27/3101348.html

const encodeStr1 = common.hashids_encode([ '66', 77, '88', 99 ]);// 参数只支持数字或数字数组；不合法的将返回空字符串

// console.log('字符串加密成短字符串');
console.log('hashids_encode:' + encodeStr1 + '||end');
// console.log('短字符串解密');
console.log('hashids_decode:' + common.hashids_decode(encodeStr1) + '||end');
console.log(common.hashids_decode(encodeStr1));

// 加解密
const encryptStr = common.encrypt('sdf2233d$dsf||33||username');
console.log('encryptStr:' + encryptStr);
const decryptStr = common.decrypt(encryptStr);
console.log('decryptStr:' + decryptStr);

// CryptoJS 加解密
const encryptStr1 = common.encryptByKey('sdf2233d$dsf||33||usernamesdfsfsdfesfsfesdfsdfsdfdsfsdfdsfsfwleflkdsjfkljdfsdfjlejflksfjksdjfklej=======', '9264e500-a560-11e9-9814-8d5334734b4e');
console.log('encryptStr1:' + encryptStr1);
const decryptStr1 = common.decryptByKey(encryptStr1, '9264e500-a560-11e9-9814-8d5334734b4e');
console.log('decryptStr1:' + decryptStr1);
const decryptStr11 = common.decryptByKey('U2FsdGVkX18yI7NRyY7l4fr7QtgXyowy/uW1E2dgunpB3hd14M28gROjJXvcSBi9');
console.log('decryptStr11:' + decryptStr11);

// CryptoJS 加解密 带iv
const encryptStr2 = common.encryptByKeyIv('{"userinfo":{"user_id":1,"user_account":"navi"},"department_name":"通信开放事业部","user_authoritys":[{"authority_id":8,"authority_code":"txkfsyb-auth","authority_name":"通信开放事业部数据权限","authority_desc":"通信开放事业部","disabled":0},{"authority_id":1,"authority_code":"first-review","authority_name":"初审权限","authority_desc":null,"disabled":0}]}{"userinfo":{"user_id":1,"user_account":"navi"},"department_name":"通信开放事业部","user_authoritys":[{"authority_id":8,"authority_code":"txkfsyb-auth","authority_name":"通信开放事业部数据权限","authority_desc":"通信开放事业部","disabled":0},{"authority_id":1,"authority_code":"first-review","authority_name":"初审权限","authority_desc":null,"disabled":0}]}', '9264e500-a560-11e9-9814-8d5334734b4e', 333);
console.log('encryptStr2:' + encryptStr2);
const decryptStr2 = common.decryptByKeyIv(encryptStr2, '9264e500-a560-11e9-9814-8d5334734b4e', 3233);
console.log('decryptStr2:' + decryptStr2);





