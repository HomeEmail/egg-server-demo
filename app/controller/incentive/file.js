const Controller = require('../../core/base_controller');
const path = require('path');
const fs = require('fs');
//const common = require('../../common/common');
class FileController extends Controller {
  /**
	 * @api {post} /api/getFileList 获取附件列表
	 * @apiDescription 获取附件列表
	 * @apiName getFileList
	 * @apiGroup File
   * @apiParam {Number} [pageNo] 第几页,从1开始 默认1
   * @apiParam {Number} [pageSize] 每页多少行数据 默认10
	 * @apiSuccess {Number} code 1成功 0失败
	 * @apiSuccess {String} message 消息
   * @apiSuccess {Number} totalCount 记录总数
   * @apiSuccess {Object[]} data 
   * @apiSuccess {String} data.file_name 文件名称
   * @apiSuccess {Int} data.file_id 文件id
   * @apiSuccess {String} data.create_at 上传时间
	 * @apiVersion 1.0.0
	 */
  async getFileList(){
    const { ctx } = this;
    //获取post过来的参数
    let param = ctx.request.body;
    //创建参数校验规则
    let createRule = {
      pageNo: {
        type: 'int',
        required: false,//默认就是true
        default: 1,
      },
      pageSize: {
        type: 'int',
        required: false,//默认就是true
        default: 10,
      },
    };
    // 校验 `ctx.request.body` 是否符合我们预期的格式
    // 如果参数校验未通过，将会抛出一个 status = 422 的异常
    try {
      ctx.validate(createRule, param);
    } catch (err) {
      ctx.logger.warn(err.message);
      this.failure('参数有误！');
      return 0;
    }

    const userAuths = await this.get_user_authoritys();
    //检查权限
    if(!this.checkHasFinalReviewAuth(userAuths)){
      this.failure('您没有权限查看全部附件！');
      return 0;
    }
    try{
      let totalCount = await ctx.service.incentive.file.getFileListTotalCount();
      let result = await ctx.service.incentive.file.getFileList(param.pageNo,param.pageSize);
      this.success({data:result||[],...param,...totalCount[0]});
    }catch(err){
      ctx.logger.error(err);
      this.failure('系统错误');
    }
  }
  /**
	 * @api {post get} /api/downloadFile 下载文件
	 * @apiDescription 下载文件
	 * @apiName downloadFile
	 * @apiGroup File
   * @apiParam {Number} file_id 文件id
	 * @apiSuccess {Stream} file 文件流
	 * @apiVersion 1.0.0
	 */
  async downloadFile(){
    const { ctx } = this;
    //获取post过来的参数
    let param = ctx.request.body;
    if(!param.file_id){
      param = ctx.query;
    }
    //创建参数校验规则
    let createRule = {
      file_id: {
        type: 'int',
        required: true,//默认就是true
        convertType:'int',
      },
    };
    // 校验 `ctx.request.body` 是否符合我们预期的格式
    // 如果参数校验未通过，将会抛出一个 status = 422 的异常
    try {
      ctx.validate(createRule, param);
    } catch (err) {
      ctx.logger.warn(err.message);
      this.failure('参数有误！');
      return 0;
    }
    try{
      let fileObj = await ctx.service.incentive.file.getOneByFileId(param.file_id);
      const uploadBasePath = this.config.uploadBasePath;
      const attachment_file_path = path.join(uploadBasePath, fileObj.file_path);
      const size = fs.statSync(attachment_file_path).size;
      let f = fs.createReadStream(attachment_file_path);
      ctx.set('Content-Type','application/force-download');
      ctx.set('Content-Disposition','attachment; filename='+encodeURIComponent(fileObj.file_name));
      ctx.set('Content-Length',size);
      //f.pipe(ctx.response);
      ctx.status=200;
      ctx.body = f;
    }catch(err){
      ctx.logger.error(err);
      this.failure('系统错误');
    }
  }
  /**
	 * @api {get} /api/downloadXlsxTpl 下载表格模版
	 * @apiDescription 下载表格模版
	 * @apiName downloadXlsxTpl
	 * @apiGroup File
	 * @apiVersion 1.0.0
	 */
  async downloadXlsxTpl(){
    const { ctx } = this;
    try{
      let fileName = '省本部激励提成项目基础数据导入模板.xlsx';
      const uploadBasePath = this.config.uploadBasePath;
      const attachment_file_path = path.join(uploadBasePath, fileName);
      const size = fs.statSync(attachment_file_path).size;
      let f = fs.createReadStream(attachment_file_path);
      ctx.set('Content-Type','application/force-download');
      ctx.set('Content-Disposition','attachment; filename='+encodeURIComponent(fileName));
      ctx.set('Content-Length',size);
      //f.pipe(ctx.response);
      ctx.status=200;
      ctx.body = f;
    }catch(err){
      ctx.logger.error(err);
      this.failure('系统错误');
    }
  }
  
}

module.exports = FileController;