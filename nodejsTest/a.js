//exports.a='a str'; //输出 { a: 'a str' }
exports.a={a1:'a1'};//输出 { a: { a: 'a' } }
//exports.a=function(){console.log('function');};//输出  { a: [Function] }
exports.aa="aa";

// module.exports={
//     aa:'aa'
// }; //输出{ aa: 'aa' } 会覆盖前面定义的exports.a


// module.exports=function(){
//     console.log('module.exports function');
// }; //输出就是个函数 //后面的exports.a 无效
//module.exports='aa str'; //输出就是个字符串 ，//后面的exports.a无效
//exports.a='a str';

