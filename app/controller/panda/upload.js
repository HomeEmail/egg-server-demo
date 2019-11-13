//const Controller = require('egg').Controller;
const Controller = require('../../core/base_controller');
const fs = require('mz/fs');
const path = require('path');
const sendToWormhole = require('stream-wormhole');
const awaitStreamReady = require('await-stream-ready');
const moment = require('moment');

class UploadController extends Controller{
	async up(){
		const {ctx} = this;
        //console.log('ctx.request.body',ctx.request.body);
        let parts ;
        try{
            parts = ctx.multipart();// parts() 返回 promise 对象
        }catch(err){
            this.failure('参数或请求方式不对！');
            return 0;
        }
		
		//数据
		let returnPath = '';//返回上传的路径后缀
		//let uploadBasePath=path.resolve(__dirname,'../../upload/');
		//console.log('---this.config.uploadBasePath---'+this.config.uploadBasePath);
		let uploadBasePath=this.config.uploadBasePath;
		//console.log(uploadBasePath);
		let toPathName='';//目标路径
		let part;
		try{
			while((part = await parts()) != null){
				if(part.length){
					//这里是处理表单非file类型的字段
					// console.log('field:'+part[0]);//key
					// console.log('value:'+part[1]);//value
					// console.log('valueTruncated:'+part[2]);
					// console.log('fieldnameTruncated:'+part[3]);
				}else{
					if(!part.filename){
						// 这时是用户没有选择文件就点击了上传(part 是 file stream，但是 part.filename 为空)
						// 需要做出处理且必须销毁stream，否则导致程序无响应，例如给出错误提示消息
						try{
							await sendToWormhole(part);//销毁stream
						}catch(err){
							ctx.logger.error(err.errors);
						}
						//return;
					}else{
						// console.log('--------------');
						// console.log('field:'+part.fieldname);
						// console.log('filename:'+part.filename);
						// console.log('encoding:'+part.encoding);
						// console.log('mime:'+part.mime);
						//保存的文件名
						let newFileName=Date.now() + '' + Number.parseInt(Math.random() * 10000) + path.extname(part.filename);
						//生产文件夹
						let dirName=moment(Date.now()).format('YYYYMMDD');
						let dirPath=path.join(uploadBasePath,dirName);
						// 判断文件夹是否存在，不存在则直接创建文件夹
						if(! await fs.exists(dirPath)){
							await fs.mkdir(dirPath);
						}else{
							//console.log('文件夹存在'+dirPath);
						}
						//目标路径
						toPathName=path.join(dirPath,newFileName);
						
						// console.log({
						// 	filename:part.filename,
						// 	encoding:part.encoding,
						// 	mime:part.mime,
						// 	newFileName:newFileName,
						// 	toPathName:toPathName
						// });
						
						//文件处理
						try{
							const writeStream = fs.createWriteStream(toPathName);
							await awaitStreamReady.write(part.pipe(writeStream));
							returnPath=dirName + '\\' + newFileName;

						}catch(err){
							//throw err;
							ctx.logger.error(err.message);
						}finally{
							await sendToWormhole(part);//销毁stream
						}
					}
				}
			}
			
			this.success({data:returnPath});

		}catch(err){
			this.failure('上传报错：'+err.message);
		}
	}
}

module.exports = UploadController;