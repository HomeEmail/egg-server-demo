const Controller = require('../../core/base_controller');
const path = require('path');
//const common = require('../../common/common');
class ImportController extends Controller {
  /**
	 * @api {post} /api/importAction 导入文件内容
	 * @apiDescription 导入文件内容
	 * @apiName importAction
	 * @apiGroup Common
	 * @apiParam {Number} [tables_id] 表id，如有就是更新表格记录，否则就是新建表格记录
   * @apiParam {Number} table_file_id 表格文件id
   * @apiParam {Number} attachment_file_id 附件文件id 
	 * @apiSuccess {Number} code 1成功 0失败
	 * @apiSuccess {String} message 消息
	 * @apiVersion 1.0.0
	 */
  async index() {
    const { ctx } = this;
    //获取post过来的参数
    let param = ctx.request.body;
    //创建参数校验规则
    let createRule = {
      tables_id: {
        type: 'int',
        required: false,//默认就是true
      },
      table_file_id: {
        type: 'int',
        required: true,//默认就是true
      },
      attachment_file_id: {
        type: 'int',
        required: true,//默认就是true
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

    const table_file_obj = await ctx.service.incentive.file.getOneByFileId(param.table_file_id);
    //console.log(table_file_obj);
    if (!table_file_obj.file_id) {
      this.failure('找不到表格文件，请重新导入');
      return 0;
    }
    const attachment_file_obj = await ctx.service.incentive.file.getOneByFileId(param.attachment_file_id);
    if (!attachment_file_obj.file_id) {
      this.failure('找不到附件文件，请重新导入');
      return 0;
    }
    const uploadBasePath = this.config.uploadBasePath;
    const table_file_path = path.join(uploadBasePath, table_file_obj.file_path);
    //const attachment_file_path = path.join(uploadBasePath, attachment_file_obj.file_path);
    const table_file_data = await ctx.service.incentive.import.checkAndReadXlsData(table_file_path);

    if (!!table_file_data) {
      //检查权限 是否可以上传此部门数据
      const userAuths = await this.get_user_authoritys();
      let isAllowDepartment = true;
      let invalidDepartmentName = '';
      let isAllOneDepartment = true;//表格里是否都是同一个部门
      let isAllOneAccrual = true;//表格里是否都是同一个季度
      table_file_data.forEach(v=>{
        if(!this.checkHasThisDepartmentAuth(userAuths,v[3])){
          invalidDepartmentName=v[3];
          isAllowDepartment = false;
        }
        if(!v[1] || table_file_data[0][1]!==v[1]){
          isAllOneAccrual = false;
        }
        if(!v[3] || table_file_data[0][3]!==v[3]){
          isAllOneDepartment = false;
        }
      });
      if(!isAllowDepartment){
        this.failure('您没有权限上传['+invalidDepartmentName+']的数据！');
        return 0;
      }
      if(!isAllOneDepartment){
        this.failure('表格每行数据要求必须是同一个部门');
        return 0;
      }
      if(!isAllOneAccrual){
        this.failure('表格每行数据要求必须是同一个季度');
        return 0;
      }
      if (!!param.tables_id) { //更新
        await this.updateAction(param.tables_id,param.attachment_file_id,table_file_data);
      } else { //新增
        await this.insertAction(param.attachment_file_id,table_file_data);
      }
    } else {
      this.failure('表格数据内容或格式有误，表格数据每列要求必填，请检查表格数据！');
      return 0;
    }

    // this.success({
    //   data: {
    //     ...param,
    //   }
    // });
  }
  async insertAction(attachment_file_id,table_file_data) {
    const { ctx } = this;
    try {
      const length = table_file_data.length;
      // let user_id = 0, user_account = 'sys';
      // if (ctx.session.userinfo) {
      //   user_id = ctx.session.userinfo.user_id;
      //   user_account = ctx.session.userinfo.user_account;
      // }
      let tables_obj = {
        user_id: this.user.user_id,
        user_account: this.user.user_account,
        accrual_time: table_file_data[0][1],
        department_name: table_file_data[0][3],
        row_num: length,
        review_status_id: 0,
      };
      const insert_tables_id = await ctx.service.incentive.tables.insertTablesRecord(tables_obj);
      if (!insert_tables_id) {
        this.failure('插入表格失败，请重新导入，表格不允许出现之前上传过的某部门某季度的数据，如要更改之前的数据请找到对应表格点击“重新导入”');
        return 0;
      }
      await ctx.service.incentive.file.insertRelaTablesFileRecord({
        tables_id:insert_tables_id,
        file_id:attachment_file_id
      });
      for (let i = 0; i < length; i++) {
        await this.handleRowDataAction(insert_tables_id,table_file_data,i);
      }
      this.success({
      });
    } catch (err) {
      //console.log(err);
      ctx.logger.error(err);
      this.failure('系统错误');
      return 0;
    }
  }
  async handleRowDataAction(tables_id,table_file_data,i){
    const { ctx } = this;
    let incentiveData = {};
    let index = -1;
    incentiveData = {
      tables_id: tables_id,
      serial_number: table_file_data[i][++index],
      accrual_time: table_file_data[i][++index],
      writeoff_time: table_file_data[i][++index],
      department_name: table_file_data[i][++index],
      profession_name: table_file_data[i][++index],
      business_type_name: table_file_data[i][++index],
      commission_type_name: table_file_data[i][++index],
      contracting_entity_name: table_file_data[i][++index],
      branch_company_name: table_file_data[i][++index],
      income_type_name: table_file_data[i][++index],
      business_oppo_type_name: table_file_data[i][++index],
      plan_type_name: table_file_data[i][++index],
      implement_type_name: table_file_data[i][++index],
      project_type_name: table_file_data[i][++index],
      customer_name: table_file_data[i][++index],
      industry_name: table_file_data[i][++index],
      if_provincial: table_file_data[i][++index],
      if_new_project: table_file_data[i][++index],
      project_number: table_file_data[i][++index],
      project_name: table_file_data[i][++index],
      contract_total_revenue: table_file_data[i][++index],
      contract_total_cost: table_file_data[i][++index],
      other_cost: table_file_data[i][++index],
      current_quarterly_sale_revenue: table_file_data[i][++index],
      gross_interest_rate: table_file_data[i][++index],
      proportion_provincial_support_contribution: table_file_data[i][++index],
      proportion_provincial_sale_contribution: table_file_data[i][++index],
      user_id:this.user.user_id,
      user_account:this.user.user_account,
    };
    //数字类型过滤转换
    if(incentiveData.contract_total_revenue=='-'||!incentiveData.contract_total_revenue){
      incentiveData.contract_total_revenue=0;
    }
    if(incentiveData.contract_total_cost=='-'||!incentiveData.contract_total_cost){
      incentiveData.contract_total_cost=0;
    }
    if(incentiveData.other_cost=='-'||!incentiveData.other_cost){
      incentiveData.other_cost=0;
    }
    if(incentiveData.current_quarterly_sale_revenue=='-'||!incentiveData.current_quarterly_sale_revenue){
      incentiveData.current_quarterly_sale_revenue=0;
    }
    if(incentiveData.gross_interest_rate=='-'||!incentiveData.gross_interest_rate){
      incentiveData.gross_interest_rate=0;
    }
    if(incentiveData.proportion_provincial_support_contribution=='-'||!incentiveData.proportion_provincial_support_contribution){
      incentiveData.proportion_provincial_support_contribution=0;
    }
    if(incentiveData.proportion_provincial_sale_contribution=='-'||!incentiveData.proportion_provincial_sale_contribution){
      incentiveData.proportion_provincial_sale_contribution=0;
    }
    let insert_incentive_data_id = await ctx.service.incentive.incentiveData.insertIncentiveDataRecord(incentiveData);
    if (!insert_incentive_data_id) {
      this.failure('导入数据遇到错误，请检查数据格式再导入');
      return 0;
    }
    await ctx.service.incentive.reviewRecord.insertReviewRecord({
      incentive_data_id:insert_incentive_data_id,
      review_status_id:0,
      review_status_name:'待确认',
      user_id:this.user.user_id,
      user_account:this.user.user_account,
      review_comment:'',
    });
    return 1;
  }
  async updateAction(tables_id,attachment_file_id,table_file_data) {
    const { ctx } = this;
    //console.log('updateAction');
    try{
      //先看看这条记录是不是本人上传的
      const oneData = await ctx.service.incentive.tables.getOneByTablesId(tables_id);
      if(!!oneData&&!!oneData.user_id){
        if(oneData.user_id!=this.user.user_id){
          //console.log('oneData.user_id:'+oneData.user_id+' this.user.user_id:'+this.user.user_id);
          //ctx.logger.warn('oneData.user_id:'+oneData.user_id+' this.user.user_id:'+this.user.user_id);
          this.failure('此表格不是当前账号创建的，更新表格数据失败，请使用创建表格的账号更新');
          return 0;
        }
      } else {
        this.failure('无此表格记录，更新表格数据失败');
        return 0;
      }
      //将之前的数据失效掉
      await ctx.service.incentive.incentiveData.disableIncentiveDataByTablesIdAndUserId(tables_id,this.user.user_id);
      const length = table_file_data.length;
      // let user_id = 0, user_account = 'sys';
      // if (ctx.session.userinfo) {
      //   user_id = ctx.session.userinfo.user_id;
      //   user_account = ctx.session.userinfo.user_account;
      // }
      let tables_obj = {
        user_id: this.user.user_id,
        user_account: this.user.user_account,
        accrual_time: table_file_data[0][1],
        department_name: table_file_data[0][3],
        row_num: length,
        review_status_id: 0,
      };
      const updateRowNum = await ctx.service.incentive.tables.updateTablesRecord(tables_id,tables_obj);
      if (!updateRowNum) {
        this.failure('更新表格失败，请重新导入');
        return 0;
      }

      await ctx.service.incentive.file.disabledRelaTablesFileRecordByTablesId(tables_id);
      await ctx.service.incentive.file.insertRelaTablesFileRecord({
        tables_id:tables_id,
        file_id:attachment_file_id
      });
      for (let i = 0; i < length; i++) {
        await this.handleRowDataAction(tables_id,table_file_data,i);
      }
      this.success({
      });
    } catch(err){
      ctx.logger.error(err);
      this.failure('系统错误');
    }
  }

}

module.exports = ImportController;