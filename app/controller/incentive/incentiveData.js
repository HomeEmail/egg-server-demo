const Controller = require('../../core/base_controller');
const path = require('path');
const fs = require('fs');
const ejsexcel = require("ejsexcel");
const {toSream} = require('../../common/util');
//const common = require('../../common/common');
class IncentiveDataController extends Controller {
  /**
	 * @api {post} /api/getTablesDetail 获取表格数据详情
	 * @apiDescription 获取表格数据详情
	 * @apiName getTablesDetail
	 * @apiGroup Tables
   * @apiParam {Number} tables_id 表格id
	 * @apiSuccess {Number} code 1成功 0失败
	 * @apiSuccess {String} message 消息
   * @apiSuccess {Object[]} data 
   * @apiSuccess {Int} data.incentive_data_id 激励数据id
   * @apiSuccess {Int} data.tables_id 表格id
   * @apiSuccess {Int} data.serial_number 序号
   * @apiSuccess {String} data.accrual_time 计提时间
   * @apiSuccess {String} data.department_name 部门名称
   * @apiSuccess {String} data.profession_name 专业
   * @apiSuccess {String} data.business_type_name 业务大类
   * @apiSuccess {String} data.commission_type_name 提成分类
   * @apiSuccess {String} data.contracting_entity_name 签约主体
   * @apiSuccess {String} data.branch_company_name 分公司
   * @apiSuccess {String} data.income_type_name 收入类型
   * @apiSuccess {String} data.business_oppo_type_name 商机类型
   * @apiSuccess {String} data.plan_type_name 方案类型
   * @apiSuccess {String} data.implement_type_name 实施类型
   * @apiSuccess {String} data.project_type_name 项目类型
   * @apiSuccess {String} data.customer_name 客户名称
   * @apiSuccess {String} data.industry_name 行业
   * @apiSuccess {String} data.if_provincial 是否省名单制
   * @apiSuccess {String} data.if_new_project 是否新增项目
   * @apiSuccess {String} data.project_number 项目编号
   * @apiSuccess {String} data.project_name 项目名称
   * @apiSuccess {Number} data.contract_total_revenue 合同收入总额（元）
   * @apiSuccess {Number} data.contract_total_cost 合同成本总额（元）
   * @apiSuccess {Number} data.current_quarterly_sale_revenue 当季度销账收入（元）
   * @apiSuccess {Number} data.gross_interest_rate 毛利率%
   * @apiSuccess {Number} data.proportion_provincial_support_contribution 省支撑贡献度占比%
   * @apiSuccess {String} data.review_comment 审核意见
	 * @apiVersion 1.0.0
	 */
  async getTablesDetail(){
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
      ctx.logger.warn(err.message);
      this.failure('参数有误！');
      return 0;
    }
    try{
      let result = await ctx.service.incentive.incentiveData.getIncentiveDataListByTablesId(param.tables_id);
      this.success({data:result||[]});
    }catch(err){
      ctx.logger.error(err);
      this.failure('系统错误');
    }
  }

  /**
   *
   *
   * @param {*} [query={}]
   * @param {Int} query.review_status_id 审核状态
   * @param {String} query.accrual_time 计提时间
   * @param {String} query.department_name 部门
   * @param {String} query.profession_name 专业
   * @param {String} query.contracting_entity_name 签约主体
   * @param {String} query.commission_type_name 提成分类
   * @param {String} query.project_number 项目编码
   * @param {String} query.project_name 项目名称
   * @memberof IncentiveDataController
   */
  async getIncentiveDataList(query={}){
    const { ctx } = this;
    try{
      //debugger;
      let totalCount = await ctx.service.incentive.incentiveData.getIncentiveDataListTotalCountByQuery(query);
      let result = await ctx.service.incentive.incentiveData.getIncentiveDataListByQuery(query);
      this.success({data:result||[],...totalCount[0],...query});
    }catch(err){
      ctx.logger.error(err);
      this.failure('系统错误');
    }
  }
  /**
	 * @api {post} /api/getReviewDataList 获取待审核数据列表
	 * @apiDescription 获取待审核数据列表
	 * @apiName getReviewDataList
	 * @apiGroup Tables
   * @apiParam {Number} reviewType 审核类型 默认1 1:初审 2:终审
   * @apiParam {Number} [pageNo] 第几页,从1开始 默认1
   * @apiParam {Number} [pageSize] 每页多少行数据 默认10
   * @apiParam {String} [accrual_time] 计提时间
   * @apiParam {String} [department_name] 部门
   * @apiParam {String} [profession_name] 专业
   * @apiParam {String} [contracting_entity_name] 签约主体
   * @apiParam {String} [commission_type_name] 提成分类
   * @apiParam {String} [project_number] 项目编码
   * @apiParam {String} [project_name] 项目名称
	 * @apiSuccess {Number} code 1成功 0失败
	 * @apiSuccess {String} message 消息
   * @apiSuccess {Number} totalCount 记录总数
   * @apiSuccess {Object[]} data 与【获取表格数据详情】接口返回的字段一样，外加如下字段
   * @apiSuccess {String} data.review_status_name 审核状态名称
	 * @apiVersion 1.0.0
	 */
  async getReviewDataList(){
    const { ctx } = this;
    //获取post过来的参数
    let param = ctx.request.body;
    //创建参数校验规则
    let createRule = {
      reviewType:{
        type: 'int',
        required: true,//默认就是true
      },
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
      accrual_time: {
        type: 'string',
        required: false,//默认就是true
      },
      department_name: {
        type: 'string',
        required: false,//默认就是true
      },
      profession_name: {
        type: 'string',
        required: false,//默认就是true
      },
      contracting_entity_name: {
        type: 'string',
        required: false,//默认就是true
      },
      commission_type_name: {
        type: 'string',
        required: false,//默认就是true
      },
      project_number: {
        type: 'string',
        required: false,//默认就是true
      },
      project_name: {
        type: 'string',
        required: false,//默认就是true
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
    //权限判断 
    const userAuths = await this.get_user_authoritys();
    
    if(param.reviewType===1){//初审列表
      if(!this.checkHasFirstReviewAuth(userAuths)){
        this.failure('您没有初审权限审核数据！');
        return 0;
      }
      param.review_status_id=1;//审核中
      await this.getIncentiveDataList(param);
    }
    if(param.reviewType===2){//终审列表
      if(!this.checkHasFinalReviewAuth(userAuths)){
        this.failure('您没有终审权限审核数据！');
        return 0;
      }
      param.review_status_id=2;//初审通过
      await this.getIncentiveDataList(param);
    }
  }

  /**
	 * @api {post} /api/getResultReportList 获取结果展示数据列表
	 * @apiDescription 获取结果展示数据列表
	 * @apiName getResultReportList
	 * @apiGroup Tables
   * @apiParam {Number} [pageNo] 第几页,从1开始 默认1
   * @apiParam {Number} [pageSize] 每页多少行数据 默认10
   * @apiParam {String} [accrual_time] 计提时间
   * @apiParam {String} [department_name] 部门
   * @apiParam {String} [profession_name] 专业
   * @apiParam {String} [contracting_entity_name] 签约主体
   * @apiParam {String} [commission_type_name] 提成分类
   * @apiParam {String} [project_number] 项目编码
   * @apiParam {String} [project_name] 项目名称
	 * @apiSuccess {Number} code 1成功 0失败
	 * @apiSuccess {String} message 消息
   * @apiSuccess {Number} totalCount 记录总数
   * @apiSuccess {Object[]} data 与【获取表格数据详情】接口返回的字段一样,外加如下字段
   * @apiSuccess {Number} data.gross_profit 项目毛利额（元）
   * @apiSuccess {String} data.if_can_accrual 是否可参与计提
   * @apiSuccess {Number} data.basic_commission_ratio 基础提成比例%
   * @apiSuccess {Number} data.overlay_ratio 叠加比例%
   * @apiSuccess {Number} data.addition_factor 加成系数
   * @apiSuccess {Number} data.gross_profit_factor 毛利系数
   * @apiSuccess {Number} data.support_commission_profit_radio 支撑提成占利比%
   * @apiSuccess {Number} data.support_commission_revenue_radio 支撑提成占收比%
   * @apiSuccess {Number} data.quarterly_sale_commission 当季度核算销售提成（元）
   * @apiSuccess {Number} data.quarterly_support_commission 当季度核算支撑提成（元）
   * @apiSuccess {Number} data.quarterly_total_commission 当季度核算提成合计（元）
   * @apiSuccess {Number} data.cumulative_sale_commission 累计销售提成（元）
   * @apiSuccess {Number} data.cumulative_support_commission 累计支撑提成（元）
   * @apiSuccess {Number} data.cumulative_total_commission 累计提成合计（元）
   * @apiSuccess {String} data.conditional_1 条件判断1
   * @apiSuccess {String} data.conditional_2 条件判断2
   * @apiSuccess {String} data.conditional_3 条件判断3
   * @apiSuccess {Number} data.quarterly_pay_sale_commission 当季度发放销售提成（元）
   * @apiSuccess {Number} data.quarterly_pay_support_commission 当季度发放支撑提成（元）
   * @apiSuccess {Number} data.quarterly_pay_total_commission 当季度发放提成合计（元）
	 * @apiVersion 1.0.0
	 */
  async getResultReportList(){
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
      accrual_time: {
        type: 'string',
        required: false,//默认就是true
      },
      department_name: {
        type: 'string',
        required: false,//默认就是true
      },
      profession_name: {
        type: 'string',
        required: false,//默认就是true
      },
      contracting_entity_name: {
        type: 'string',
        required: false,//默认就是true
      },
      commission_type_name: {
        type: 'string',
        required: false,//默认就是true
      },
      project_number: {
        type: 'string',
        required: false,//默认就是true
      },
      project_name: {
        type: 'string',
        required: false,//默认就是true
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
    const userAuths = await this.get_user_authoritys();
    //根据部门权限判断此用户是否有权限可查询对应的结果
    if(!this.checkHasViewAlldataResultAuth(userAuths)){
      if(!param.department_name){//没选择部门 判断是否有全量数据权限
        if(!this.checkHasViewAlldataResultAuth(userAuths)){
          this.failure('您没有权限查看全量数据！查询你所属部门数据请先选择部门！');
          return 0;
        }
      } else{ //选择了部门 判断是否有此部门权限
        if(!this.checkHasThisDepartmentAuth(userAuths,param.department_name)){
          this.failure('您没有权限查看['+param.department_name+']的数据！');
          return 0;
        }
      }
    }
    param.review_status_id=6;//完成
    await this.getIncentiveDataList(param);
  }

  /**
	 * @api {post get} /api/exportResultReportList 导出结果展示数据列表到excel
	 * @apiDescription 导出结果展示数据列表到excel
	 * @apiName exportResultReportList
	 * @apiGroup Tables
   * @apiParam {Number} [pageNo] 第几页,从1开始 默认1
   * @apiParam {Number} [pageSize] 每页多少行数据 默认10
   * @apiParam {String} [accrual_time] 计提时间
   * @apiParam {String} [department_name] 部门
   * @apiParam {String} [profession_name] 专业
   * @apiParam {String} [contracting_entity_name] 签约主体
   * @apiParam {String} [commission_type_name] 提成分类
   * @apiParam {String} [project_number] 项目编码
   * @apiParam {String} [project_name] 项目名称
	 * @apiSuccess {Stream} file 文件流
	 * @apiVersion 1.0.0
	 */
  async exportResultReportList(){
    const { ctx } = this;
    //获取post 或 get过来的参数
    let param = ctx.query;
    param = {
      ...param,
      ...ctx.request.body,
    };
    if(param.pageNo){
      param.pageNo = parseInt(param.pageNo, 10);
    }
    if(param.pageSize){
      param.pageSize = parseInt(param.pageSize, 10);
    }
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
      accrual_time: {
        type: 'string',
        required: false,//默认就是true
      },
      department_name: {
        type: 'string',
        required: false,//默认就是true
      },
      profession_name: {
        type: 'string',
        required: false,//默认就是true
      },
      contracting_entity_name: {
        type: 'string',
        required: false,//默认就是true
      },
      commission_type_name: {
        type: 'string',
        required: false,//默认就是true
      },
      project_number: {
        type: 'string',
        required: false,//默认就是true
      },
      project_name: {
        type: 'string',
        required: false,//默认就是true
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
    const userAuths = await this.get_user_authoritys();
    //根据部门权限判断此用户是否有权限可导出对应的结果
    if(!this.checkHasViewAlldataResultAuth(userAuths)){
      if(!param.department_name){//没选择部门 判断是否有全量数据权限
        if(!this.checkHasViewAlldataResultAuth(userAuths)){
          this.failure('您没有权限导出全量数据！导出你所属部门数据请先选择部门！');
          return 0;
        }
      } else{ //选择了部门 判断是否有此部门权限
        if(!this.checkHasThisDepartmentAuth(userAuths,param.department_name)){
          this.failure('您没有权限导出['+param.department_name+']的数据！');
          return 0;
        }
      }
    }
    param.review_status_id=6;//完成
    try{
      //debugger;
      //let totalCount = await ctx.service.incentive.incentiveData.getIncentiveDataListTotalCountByQuery(param);
      let result = await ctx.service.incentive.incentiveData.getIncentiveDataListByQuery(param);
      //数据写表格
      if(!!result&&result.length>0){
        for(let i=0,len=result.length;i<len;i++){
          result[i].index = i+1;
        }
      }else{
        result = [];
      }
      let tplName = 'exportXlsxTpl.xlsx';
      const uploadBasePath = this.config.uploadBasePath;
      const export_file_tpl_path = path.join(uploadBasePath, tplName);
      //获得Excel模板的buffer对象
      const exlBuf = fs.readFileSync(export_file_tpl_path);
      //用数据源(对象)result渲染Excel模板
      const exlBuf2 = await ejsexcel.renderExcel(exlBuf, result);

      const size = exlBuf2.length;//fs.statSync(path).size;
      //debugger;
      let f = toSream(exlBuf2);
      let fileName='激励提成数据报表导出_'+Date.now()+'.xlsx';
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

module.exports = IncentiveDataController;
