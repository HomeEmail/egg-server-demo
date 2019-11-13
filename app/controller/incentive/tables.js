const Controller = require('../../core/base_controller');
//const path = require('path');
//const fs = require('fs');
//const common = require('../../common/common');
class TablesController extends Controller {
  /**
	 * @api {post} /api/getTablesList 获取表格列表
	 * @apiDescription 获取表格列表
	 * @apiName getTablesList
	 * @apiGroup Tables
   * @apiParam {Number} [pageNo] 第几页,从1开始 默认1
   * @apiParam {Number} [pageSize] 每页多少行数据 默认10
	 * @apiSuccess {Number} code 1成功 0失败
	 * @apiSuccess {String} message 消息
   * @apiSuccess {Number} totalCount 记录总数
   * @apiSuccess {Object[]} data 
   * @apiSuccess {Int} data.tables_id 表格id
   * @apiSuccess {String} data.accrual_time 计提时间
   * @apiSuccess {String} data.department_name 部门名称
   * @apiSuccess {Int} data.review_status_id 审核状态id 
   *                    0	待确认
                        1	审核中
                        2	初审通过
                        3	初审驳回
                        4	终审通过
                        5	终审驳回
                        6	完成
   * @apiSuccess {String} data.review_status_name 审核状态名称
   * @apiSuccess {Int} data.user_id 用户id
   * @apiSuccess {String} data.user_account 用户账号
   * @apiSuccess {String} data.file_name 文件名称
   * @apiSuccess {Int} data.file_id 文件id
   * @apiSuccess {String} data.update_at 上传时间
	 * @apiVersion 1.0.0
	 */
  async getTablesList(){
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
    //debugger;
    try {
      ctx.validate(createRule, param);
    } catch (err) {
      ctx.logger.warn(err.message);
      this.failure('参数有误！');
      return 0;
    }
    try{
      //debugger;
      //console.log('this.user_department_name',this.user_department_name);
      let totalCount = await ctx.service.incentive.tables.getTablesListByDepartmentNameTotalCount(null,this.user.user_account);
      let result = await ctx.service.incentive.tables.getTablesListByDepartmentName(null,this.user.user_account,param.pageNo,param.pageSize);
      this.success({data:result||[],...param,...totalCount[0]});
    }catch(err){
      ctx.logger.error(err);
      this.failure('系统错误');
    }
  }
  /**
	 * @api {post} /api/deleteTablesData 删除表格和数据
	 * @apiDescription 删除表格和数据
	 * @apiName deleteTablesData
	 * @apiGroup Tables
   * @apiParam {Number} tables_id 表格id
	 * @apiSuccess {Number} code 1成功 0失败
	 * @apiSuccess {String} message 消息
	 * @apiVersion 1.0.0
	 */
  async deleteTablesAndDataByUser(){
    //deleteTablesRecord
    const { ctx } = this;
    //获取post过来的参数
    let param = ctx.request.body;
    //创建参数校验规则
    let createRule = {
      tables_id: {
        type: 'int',
        required: true,//默认就是true
      },
    };
    // 校验 `ctx.request.body` 是否符合我们预期的格式
    // 如果参数校验未通过，将会抛出一个 status = 422 的异常
    //debugger;
    try {
      ctx.validate(createRule, param);
    } catch (err) {
      this.failure('参数有误！');
      return 0;
    }
    try{
      await ctx.service.incentive.tables.deleteTablesRecord({
        tables_id:param.tables_id,
        user_id:this.user.user_id,
      });
      await ctx.service.incentive.incentiveData.deleteIncentiveDataRecord({
        tables_id:param.tables_id,
        user_id:this.user.user_id,
      });
      await ctx.service.incentive.file.disabledRelaTablesFileRecordByTablesId(param.tables_id);
      this.success({});
    }catch(err){
      ctx.logger.error(err);
      this.failure('删除失败，系统错误');
    }
  }
  
}

module.exports = TablesController;
