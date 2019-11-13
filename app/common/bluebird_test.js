
var Promise = require('bluebird');//promise 库
var fs = require('fs');
var path = require('path');


var asyncObj={
	fn1:function(){
		console.log('enter fn1');
		return new Promise(function(resolve,reject){

			setTimeout(function(){
				if(true){
					console.log('out fn1');
					resolve();
				}else{
					reject('error1');
				}
			},1000);
		});
	},
	fn2:function(){
		console.log('enter fn2');
		return new Promise(function(resolve,reject){

			setTimeout(function(){
				if(true){
					console.log('out fn2');
					resolve();
				}else{
					reject('error2');
				}
			},2000);
		});
	},
	fn3:function(){
		console.log('enter fn3');
		return new Promise(function(resolve,reject){

			setTimeout(function(){
				if(true){
					console.log('out fn3');
					resolve();
				}else{
					reject('error3');
				}
			},1000);
		});
	}
};

asyncObj.fn1()
.then(asyncObj.fn2)
.then(asyncObj.fn3)
.catch(function(err){
	console.log('error1:',err);
})
.then(fs_test);



Promise.promisifyAll(fs);//处理

function fs_test(){
	fs.accessAsync(path.join(__dirname,'test.log'),fs.F_OK)
	.then(function(){
		console.log('test.log文件存在');
	})
	.catch(function(err){
		console.log('test.log文件不存在 catch:',err);
	})
	.then(function(){
		return fs.accessAsync(path.join(__dirname,'common.js'),fs.F_OK);
	})
	.then(function(){
		console.log('common.js文件存在');
	})
	.catch(function(err){
		console.log('common.js文件不存在 catch:',err);
	});
}

/*
//不要Promise的原生方法如下
//判断文件是否存在
if(fs.access(path.join(__dirname,'test.log'),fs.F_OK,function(err){
	console.log(err?'test.log文件不存在':'test.log文件存在');
}));
if(fs.access(path.join(__dirname,'common.js'),fs.F_OK,function(err){
	console.log(err?'common.js文件不存在':'common.js文件存在');
}));
*/