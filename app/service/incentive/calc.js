const Service = require('egg').Service;
//毛利率门槛值配置
const gross_interest_rate_threshold_config = [
  {
    business_type_name: 'IT服务',
    for_sale: 0.08,
    for_support: 0.08,
  },
  {
    business_type_name: 'DCT',
    for_sale: 0.08,
    for_support: 0.08,
  },
  {
    business_type_name: 'IDC轻资产（仅机柜）',
    for_sale: 0.08,
    for_support: 0.08,
  },
  {
    business_type_name: '云计算（阿里腾讯轻资产）',
    for_sale: 0.08,
    for_support: 0.08,
  },
  {
    business_type_name: '云计算（自资产及华为轻资产）',
    for_sale: 0.25,
    for_support: 0.25,
  },
  {
    business_type_name: '大数据',
    for_sale: 0.25,
    for_support: 0.25,
  },
  {
    business_type_name: 'COP（固网）',
    for_sale: 0.30,
    for_support: 0.30,
  },
  {
    business_type_name: 'COP移网',
    for_sale: 0.20,
    for_support: 0.20,
  },
  {
    business_type_name: 'X产品',
    for_sale: 0.15,
    for_support: 0.15,
  },
];
function get_gross_interest_rate_threshold(business_type_name = '', type = 'for_sale') {
  let value = 0;
  gross_interest_rate_threshold_config.forEach(v => {
    if (v.business_type_name === business_type_name) {
      value = v[type];
    }
  });
  return value;
}
class CalcService extends Service {
  async calc(datas = []) {
    const ctx = this.ctx;
    let user_id = 0, user_account = 'sys';
    if (ctx.session.userinfo) {
      user_id = ctx.session.userinfo.user_id;
      user_account = ctx.session.userinfo.user_account;
    }
    //console.log('get_gross_interest_rate_threshold',get_gross_interest_rate_threshold('COP（固网）','for_sale'));
    //console.log('end');
    /*
      accrual_time	String	计提时间
      department_name	String	部门名称
      profession_name	String	专业
      business_type_name	String	业务大类
      commission_type_name	String	提成分类
      contracting_entity_name	String	签约主体
      branch_company_name	String	分公司
      income_type_name	String	收入类型
      business_oppo_type_name	String	商机类型
      plan_type_name	String	方案类型
      implement_type_name	String	实施类型
      project_type_name	String	项目类型
      customer_name	String	客户名称
      industry_name	String	行业
      if_provincial	String	是否省名单制
      if_new_project	String	是否新增项目
      project_number	String	项目编号
      project_name	String	项目名称
      contract_total_revenue	Number	合同收入总额（元）
      contract_total_cost	Number	合同成本总额（元）
      current_quarterly_sale_revenue	Number	当季度销账收入（元）
      gross_interest_rate	Number	毛利率%
      proportion_provincial_support_contribution	Number	省支撑贡献度占比%
    */
    try {
      for (let i = 0, len = datas.length; i < len; i++) {
        datas[i] = await this.calcRow(datas[i], false);
        //console.log('11111111111111111111111');
        datas[i].review_status_id = 6; //完成
        delete datas[i].review_comment;
        //更新激励数据进数据库
        await this.updateIncentiveDataByIncentiveDataId(datas[i].incentive_data_id, datas[i]);
        //新增审核记录
        await ctx.service.incentive.reviewRecord.insertReviewRecord({
          incentive_data_id: datas[i].incentive_data_id,
          review_status_id: datas[i].review_status_id,
          review_status_name: '完成',
          review_comment: '已完成，不可再进行修改',
          user_id: user_id,
          user_account: user_account,
        });
      }

    } catch (err) {
      ctx.logger.error(err);
      //console.log('1111112222', err);
    }

  }
  async preCalc(datas = []) { //预计算
    const ctx = this.ctx;
    try {
      for (let i = 0, len = datas.length; i < len; i++) {
        datas[i] = await this.calcRow(datas[i], true);
        //更新激励数据进数据库
        await this.updateIncentiveDataByIncentiveDataId(datas[i].incentive_data_id, datas[i]);
      }
    } catch (err) {
      ctx.logger.error(err);
      //console.log('1111112222', err);
    }
  }
  //计算一行数据
  async calcRow(data={}, ispre=false) { //ispre 是否是预计算
    // gross_profit 项目毛利额（元）
    data.gross_profit = data.contract_total_revenue * data.gross_interest_rate;
    // if_can_accrual 是否可参与计提
    if (data.commission_type_name === '销售提成') {
      let threshold = get_gross_interest_rate_threshold(data.business_type_name, 'for_sale');
      if (data.if_new_project === '是' && data.if_provincial === '是' && data.gross_interest_rate >= threshold) {
        data.if_can_accrual = '是';
      } else {
        data.if_can_accrual = '否';
      }
    }
    if (data.commission_type_name === '支撑提成') {
      let threshold = get_gross_interest_rate_threshold(data.business_type_name, 'for_support');
      if (data.if_new_project === '是' && data.gross_interest_rate >= threshold) {
        if (['IT服务', 'DCT'].includes(data.business_type_name)) {
          if (data.income_type_name === '项目型') {
            if (data.contract_total_revenue > 100) {
              data.if_can_accrual = '是';
            } else {
              data.if_can_accrual = '否';
            }
          } else { //月租型
            if (data.contract_total_revenue > 60) {
              data.if_can_accrual = '是';
            } else {
              data.if_can_accrual = '否';
            }
          }
        } else {
          data.if_can_accrual = '是';
        }
      } else {
        data.if_can_accrual = '否';
      }
    }
    if (data.if_can_accrual === '否') {//该字段为“否”，则以下所有字段均不再计算，奖励为0
      data.basic_commission_ratio = 0;
      data.overlay_ratio = 0;
      data.addition_factor = 0;
      data.gross_profit_factor = 0;
      data.support_commission_profit_radio = 0;
      data.support_commission_revenue_radio = 0;
      data.quarterly_sale_commission = 0;
      data.quarterly_support_commission = 0;
      data.quarterly_total_commission = 0;
      data.cumulative_sale_commission = 0;
      data.cumulative_support_commission = 0;
      data.cumulative_total_commission = 0;
      data.conditional_1 = '否';
      data.conditional_2 = '否';
      data.conditional_3 = '否';
      data.quarterly_pay_sale_commission = 0;
      data.quarterly_pay_support_commission = 0;
      data.quarterly_pay_total_commission = 0;
    } else {
      // basic_commission_ratio 基础提成比例
      if (data.commission_type_name === '销售提成') {
        data.basic_commission_ratio = 0.01;
      } else {
        data.basic_commission_ratio = 0;
      }
      // overlay_ratio 叠加比例
      if (data.commission_type_name === '销售提成') {
        if (['云计算（阿里腾讯轻资产）', '云计算（自资产及华为轻资产）'].includes(data.business_type_name) && ['医疗'].includes(data.industry_name)) {
          data.overlay_ratio = 0.01;
        } else {
          data.overlay_ratio = 0;
        }
      } else {
        data.overlay_ratio = 0;
      }
      // addition_factor 加成系数
      if (data.commission_type_name === '支撑提成') {
        if (['云计算（阿里腾讯轻资产）', '云计算（自资产及华为轻资产）'].includes(data.business_type_name) && ['医疗', '工业'].includes(data.industry_name) && data.gross_interest_rate >= 0.25) {
          data.addition_factor = 1.5;
        } else {
          data.addition_factor = 1;
        }
      } else {
        data.addition_factor = 0;
      }
      // gross_profit_factor 毛利系数
      if (data.commission_type_name === '销售提成') {
        if (['医疗'].includes(data.industry_name)) {
          if (['IT服务', 'DCT', 'X产品'].includes(data.business_type_name)) {
            if (data.gross_interest_rate < 0.08) {
              data.gross_profit_factor = 0;
            }
            if (data.gross_interest_rate >= 0.08 && data.gross_interest_rate < 0.13) {
              data.gross_profit_factor = 1;
            }
            if (data.gross_interest_rate >= 0.13 && data.gross_interest_rate < 0.2) {
              data.gross_profit_factor = 1.2;
            }
            if (data.gross_interest_rate >= 0.2) {
              data.gross_profit_factor = 1.5;
            }
          } else {
            data.gross_profit_factor = 1;
          }
        } else {
          data.gross_profit_factor = 0;
        }
      } else {
        data.gross_profit_factor = 0;
      }
      // support_commission_profit_radio 支撑提成占利比
      if (data.commission_type_name === '销售提成') {
        data.support_commission_profit_radio = 0;
      } else { //支撑提成
        if (['IT服务', 'DCT'].includes(data.business_type_name)) {
          if (data.gross_interest_rate < 0.08) {
            data.support_commission_profit_radio = 0;
          }
          if (data.gross_interest_rate >= 0.08 && data.gross_interest_rate < 0.12) {
            data.support_commission_profit_radio = 0.085;
          }
          if (data.gross_interest_rate >= 0.12 && data.gross_interest_rate < 0.15) {
            data.support_commission_profit_radio = 0.1;
          }
          if (data.gross_interest_rate >= 0.15) {
            data.support_commission_profit_radio = 0.13;
          }
        } else {
          data.support_commission_profit_radio = 0;
        }
      }
      // support_commission_revenue_radio 支撑提成占收比
      if (data.commission_type_name === '销售提成') {
        data.support_commission_revenue_radio = 0;
      } else { //支撑提成
        data.support_commission_revenue_radio = 0;
        if (['IT服务', 'DCT'].includes(data.business_type_name)) {
          data.support_commission_revenue_radio = 0;
        }
        if (['IDC轻资产（仅机柜）'].includes(data.business_type_name)) {
          data.support_commission_revenue_radio = 0.004;
        }
        if (['云计算（阿里腾讯轻资产）'].includes(data.business_type_name)) {
          data.support_commission_revenue_radio = 0.008;
        }
        if (['云计算（自资产及华为轻资产）', '大数据', 'COP（固网）', 'COP移网', 'X产品'].includes(data.business_type_name)) {
          data.support_commission_revenue_radio = 0.017;
        }
      }
      // quarterly_sale_commission 当季度核算销售提成（元）
      if (data.commission_type_name === '销售提成') {
        if (['医疗'].includes(data.industry_name)) {
          data.quarterly_sale_commission = data.current_quarterly_sale_revenue * (data.basic_commission_ratio * data.gross_profit_factor + data.overlay_ratio) * data.proportion_provincial_sale_contribution;
        } else { // 工业 其他
          if (['IDC轻资产（仅机柜）'].includes(data.business_type_name)) {
            data.quarterly_sale_commission = data.current_quarterly_sale_revenue * data.basic_commission_ratio * data.proportion_provincial_sale_contribution;
          } else {
            data.quarterly_sale_commission = 0;
          }
        }
      } else {
        data.quarterly_sale_commission = 0;
      }
      // quarterly_support_commission 当季度核算支撑提成（元）
      if (data.commission_type_name === '销售提成') {
        data.quarterly_support_commission = 0;
      } else {
        if (['IT服务', 'DCT'].includes(data.business_type_name)) {
          data.quarterly_support_commission = data.current_quarterly_sale_revenue * data.proportion_provincial_support_contribution * data.gross_interest_rate * data.support_commission_profit_radio;
        } else {
          data.quarterly_support_commission = data.current_quarterly_sale_revenue * data.proportion_provincial_support_contribution * data.support_commission_revenue_radio * data.addition_factor;
        }
      }
      // quarterly_total_commission 当季度核算提成合计（元）
      data.quarterly_total_commission = data.quarterly_sale_commission + data.quarterly_support_commission;

      // cumulative_sale_commission 累计销售提成（元）
      let history_sale_sum = await this.getHistorySaleOrSupportCommissionSum(data.project_number, '销售提成', ispre);
      data.cumulative_sale_commission = data.quarterly_sale_commission + history_sale_sum;

      // cumulative_support_commission 累计支撑提成（元）
      let history_support_sum = await this.getHistorySaleOrSupportCommissionSum(data.project_number, '支撑提成', ispre);
      data.cumulative_support_commission = data.quarterly_support_commission + history_support_sum;

      // cumulative_total_commission 累计提成合计（元）
      data.cumulative_total_commission = data.cumulative_sale_commission + data.cumulative_support_commission;
      //下面的判断应该是拿历史值，还是当前行的值？
      // conditional_1 条件判断1
      if (data.cumulative_total_commission > (data.gross_profit * 0.5)) {
        data.conditional_1 = '是';
      } else {
        data.conditional_1 = '否';
      }
      // conditional_2 条件判断2
      if (data.cumulative_support_commission > 500000) {
        data.conditional_2 = '是';
      } else {
        data.conditional_2 = '否';
      }
      // conditional_3 条件判断3
      if (data.cumulative_sale_commission > (data.gross_profit * 0.3)) {
        data.conditional_3 = '是';
      } else {
        data.conditional_3 = '否';
      }
      // quarterly_pay_sale_commission 当季度发放销售提成（元）
      if (data.conditional_3 === '是') {
        data.quarterly_pay_sale_commission = data.gross_profit * 0.3 - history_sale_sum;//是否存在负数情况?
      } else {
        data.quarterly_pay_sale_commission = data.quarterly_sale_commission;
      }
      // quarterly_pay_support_commission 当季度发放支撑提成（元）
      if (data.conditional_2 === '是') {
        data.quarterly_pay_support_commission = 500000 - history_support_sum;
      } else {
        data.quarterly_pay_support_commission = data.quarterly_support_commission;
      }
      // quarterly_pay_total_commission 当季度发放提成合计（元）
      data.quarterly_pay_total_commission = data.quarterly_pay_sale_commission + data.quarterly_pay_support_commission;

    }
    return data;
  }

  async updateIncentiveDataByIncentiveDataId(incentive_data_id, obj) {
    const mysqlClient = this.app.mysql.get('db1');
    const row = {
      ...obj,
      update_at: mysqlClient.literals.now,
    };
    const options = {
      where: {
        incentive_data_id: incentive_data_id,
      }
    };
    const result = await mysqlClient.update('incentive_data', row, options);
    //console.log(result);
    const updateSuccess = result.affectedRows >= 1;
    if (updateSuccess) {
      return result.affectedRows;
    } else {
      return null;
    }
  }
  async getHistorySaleOrSupportCommissionSum(project_number = '', commission_type = '销售提成', ispre=false) { //支撑提成 ispre是否是预计算 预计算不需要加审核状态条件
    const mysqlClient = this.app.mysql.get('db1');
    //SELECT sum(`incentive_data`.`quarterly_pay_sale_commission`) as `sum_value` FROM `incentive_data` WHERE `incentive_data`.`disabled`=0 AND `incentive_data`.`review_status_id`=6 AND `incentive_data`.`project_number`='10' AND `incentive_data`.`commission_type_name`='销售提成';
    let sql = 'SELECT sum(`incentive_data`.'+(commission_type==='销售提成'?'`quarterly_pay_sale_commission`':'`quarterly_pay_support_commission`')+') as `sum_value` FROM `incentive_data` WHERE `incentive_data`.`disabled`=0'+(ispre?'':' AND `incentive_data`.`review_status_id`=6')+' AND `incentive_data`.`project_number`=?';

    let paramAry = [project_number];
    const result = await mysqlClient.query(sql, paramAry);
    if (!!result && !!result[0] && !!result[0].sum_value) {
      return result[0].sum_value;
    }
    return 0;
  }

}

module.exports = CalcService;