var ftp=require('ftp');
var fs=require('fs');
var config=require('../conf/ftp');
var path = require('path');
var iconv = require('iconv-lite');

var JSFtp = require('jsftp');//另外一个ftp库，中文也会乱码
var jsftp= new JSFtp({
	host: "192.168.4.21",
	port: 21, // defaults to 21 
	user: "ivan", // defaults to "anonymous" 
	pass: "123456" // defaults to "@anonymous" 
});

// jsftp.ls(".", function(err, res) {
//   res.forEach(function(file) {
//     console.log(file.name);
//   });
// });

// jsftp.list("./tvutvgo", function(err, res) {
// 	console.log(res);
	
// });


//Get a directory listing of the current (remote) working directory:
/*var c = new ftp();
c.on('ready', function() {
	c.list('/tvutvgo/',function(err, list) {
		if (err) throw err;
		//console.dir(list);
		var len=list.length;
		var element=null;
		//var buffer;
		for(var index=0;index<len;index++){
			element=list[i];
			//element.name=iconv.decode(element.name,'gb2312');
			//上传下载，文件名不能有中文，

			//Ignore directories
			if (element.type === 'd') {
				console.log('ignoring directory ' + element.name);
				return;
			}
			//Ignore non zips
			if (path.extname(element.name) == '.zip') {
				console.log('ignoring file ' + element.name);
				return;
			}
			if(element.name.indexOf('wap live')>-1){ //eclipse问题汇总 wap live hybrid
				console.log('begin Download file-->');
				c.get('/tvutvgo/'+element.name, function (err, stream) {
					if (err) throw err;
					stream.once('close', function () {
						console.log('Download File OK!');
						c.end();

					});
					stream.pipe(fs.createWriteStream(element.name));//下载到当前终端执行命令的目录下
				});
				break;
			}else{
				console.log('no this file! ->'+element.name);
				 if(index==(len-1)){//遍历到最后一个文件了
				 	c.end();
				 }
			}
		}

		//c.end();
	});
});
// connect to localhost:21 as anonymous 
c.connect(config);
*/

/*//Download remote file 'foo.txt' and save it to the local file system:
var c = new ftp();
c.on('ready', function() {
	c.get('foo.txt', function(err, stream) {
		if (err) throw err;
		stream.once('close', function() { c.end(); });
		stream.pipe(fs.createWriteStream('foo.local-copy.txt'));
	});
});
// connect to localhost:21 as anonymous 
c.connect(config);



//Upload local file 'foo.txt' to the server:
var c = new ftp();
c.on('ready', function() {
	c.put('foo.txt', 'foo.remote-copy.txt', function(err) {
		if (err) throw err;
		c.end();
	});
});
// connect to localhost:21 as anonymous 
c.connect(config);*/