var xml2js = require('xml2js');
var util = require('util');

var obj = {name: [{_:"Super",$:{date:'08/08/2008',Time:'11:22:02'}},{_:'xxoo',$:{fuck:'xx'}}], Surname: "Man", age: 23,extra:{a1:1,a2:2,a3:'a3'},ary:['a','b','c',11,{ary1:{h1:2,h2:'h'},ary2:'ad'}]};
//json to xml
var builder = new xml2js.Builder();
var xml = builder.buildObject(obj);
console.log('---json => xml---');
console.log(xml);



//xml to json 特别注意xml转成json后得表示
/*
1.节点的值都会用数组装载
2.xml仅仅有值，那么数组第一项就是字符串，否则就是对象，对象里的_ 的值才是xml的值，对象里的$对象存放xml的属性
3.多个一样的xml标签的值都会存放在josn数组里
*/

var parser = new xml2js.Parser();
var data = '<root><name date="08/08/2008" Time="11:22:02">Super</name><Surname>Man</Surname><age>23</age><extra><a1>1</a1><a2>a2</a2></extra><ary>a</ary><ary>11</ary><property name="fuck" /></root>';
parser.parseString(data, function (err, result) {
	console.log('---xml => json---');
	console.log(util.inspect(result.root, false, null));//要使用util.inspect来显示全部节点
	console.log('Done');
	console.log('---json agian => xml---');
	//再从json转成xml会是咋样呢？和data一样
	var xml = builder.buildObject(result.root);
	console.log(xml);
});






// export const someConfig='someConfig';

// export const openAlert = function () {
//     console.log('openAlert');
//     console.log('aaa');

// };

