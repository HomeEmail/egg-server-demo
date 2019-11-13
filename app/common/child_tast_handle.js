/**
 * Created by ivan on 17/10/10.
 */

//process是一个全局对象，argv返回的是一组包含命令行参数的数组。第一项为”node”，第二项为执行的js的完整路径，后面是附加在命令行后的参数
var t1=new Date().getTime();
console.log('begin:'+t1);
console.log(process.argv);
var arguments = process.argv.splice(2);//splice返回新数组，会更改原数组
console.log(arguments);

var n=0;
for(var i=0;i<1000000000;i++){
	n=n+i;
}
var t2=new Date().getTime();
console.log('time use:'+(t2-t1)/1000);
console.log('total:'+n);

