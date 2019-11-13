const Controller = require('../../core/base_controller');
//const path = require('path');
//const common = require('../../common/common');
class ReviewController extends Controller {
  /**
	 * @api {post} /api/getReviewList 获取审核流
	 * @apiDescription 获取审核流
	 * @apiName getReviewList
	 * @apiGroup Review
   * @apiParam {Number} tables_id 表格id
   * @apiParam {Number} serial_number 数据行序号
	 * @apiSuccess {Number} code 1成功 0失败
	 * @apiSuccess {String} message 消息
   * @apiSuccess {Object[]} data 
   * @apiSuccess {String} data.review_status_name 审核状态名称
   * @apiSuccess {Int} data.user_id 用户id
   * @apiSuccess {String} data.user_account 用户账号
   * @apiSuccess {String} data.review_comment 审批意见
   * @apiSuccess {String} data.create_at 审批时间
	 * @apiVersion 1.0.0
	 */
  async getReviewList(){
    const { ctx } = this;
    //获取post过来的参数
    let param = ctx.request.body;
    //创建参数校验规则
    let createRule = {
      tables_id: {
        type: 'int',
        required: true,//默认就是true
      },
      serial_number: {
        type: 'int',
        required: true,
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
      let result = await ctx.service.incentive.reviewRecord.getReviewRecordsByTablesIdAndSerialNumber(param.tables_id,param.serial_number);
      this.success({data:result||[]});
    }catch(err){
      ctx.logger.error(err);
      this.failure('系统错误');
    }
  }
  /**
	 * @api {post} /api/submitReview 提交审核
	 * @apiDescription 提交审核
	 * @apiName submitReview
	 * @apiGroup Review
   * @apiParam {Number} tables_id 表格id
	 * @apiSuccess {Number} code 1成功 0失败
	 * @apiSuccess {String} message 消息
	 * @apiVersion 1.0.0
	 */
  async submitReview(){
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
    try {
      ctx.validate(createRule, param);
    } catch (err) {
      ctx.logger.warn(err.message);
      this.failure('参数有误！');
      return 0;
    }
    try{
      let updateNum = await ctx.service.incentive.incentiveData.updateReviewStatusByTablesId(param.tables_id,1);//1待审核
      if(!updateNum){
        this.failure('激励数据提交审核失败');
        return 0;
      }
      let updateTablesNum = await ctx.service.incentive.tables.updateReviewStatusByTablesId(param.tables_id,1);//1待审核
      if(!updateTablesNum){
        this.failure('表格提交审核失败');
        return 0;
      }
      this.success({});
    }catch(err){
      this.failure('系统错误'+err);
    }
  }

  /**
	 * @api {post} /api/updateReview 更新审核状态
	 * @apiDescription 更新审核状态 用于初审 和 终审
	 * @apiName updateReview
	 * @apiGroup Review
   * @apiParam {Number} reviewType 审核类型 1初审 2终审 默认1
   * @apiParam {Number[]} incentive_data_ids 激励数据id数组
   * @apiParam {Number} reviewResultCode 审核结果 0驳回 1通过 默认0
   * @apiParam {String} review_comment 审核意见
	 * @apiSuccess {Number} code 1成功 0失败
	 * @apiSuccess {String} message 消息
	 * @apiVersion 1.0.0
	 */
  async updateReview(){
    const { ctx } = this;
    //获取post过来的参数
    let param = ctx.request.body;
    //创建参数校验规则
    let createRule = {
      reviewType: {
        type: 'int',
        required: true,//默认就是true
        default: 1,
      },
      incentive_data_ids: {
        type: 'array',
        itemType: 'int',
        required: true,//默认就是true
      },
      reviewResultCode: {
        type: 'int',
        required: true,//默认就是true
        default: 0,
      },
      review_comment: {
        type: 'string',
        required: false,
        default: '',
      },
    };
    //console.log(param);
    // 校验 `ctx.request.body` 是否符合我们预期的格式
    // 如果参数校验未通过，将会抛出一个 status = 422 的异常
    try {
      ctx.validate(createRule, param);
    } catch (err) {
      ctx.logger.warn(err.message);
      this.failure('参数有误！'+err.message);
      return 0;
    }
    if(param.incentive_data_ids.length<=0){
      this.failure('参数有误！0');
      return 0;
    }
    try{
      let review_status_id=1;
      let review_status_name='待审核';
      let review_comment=param.review_comment||'';
      let user_id = 0, user_account = 'sys';
      if (ctx.session.userinfo) {
        user_id = ctx.session.userinfo.user_id;
        user_account = ctx.session.userinfo.user_account;
      }
      //查询激励数据通过id数组
      const incentiveDatas = await ctx.service.incentive.incentiveData.getDataListByIncentiveDataIds(param.incentive_data_ids);
      if(!incentiveDatas){
        incentiveDatas = [];
      }

      let tables_ids=[];
      for(let i=0,len=incentiveDatas.length;i<len;i++){
        //收集需要更新的所属表格id
        if(!tables_ids.includes(incentiveDatas[i].tables_id)){
          tables_ids.push(incentiveDatas[i].tables_id);
        }
      }
      const userAuths = await this.get_user_authoritys();

      if(param.reviewType===1){ //初审
        //检查权限
        if(!this.checkHasFirstReviewAuth(userAuths)){
          this.failure('您没有初审权限审核数据！');
          return 0;
        }
        if(param.reviewResultCode===0){ //驳回
          review_status_id=3;
          review_status_name='初审驳回';
          
          if(incentiveDatas.length>0){ //更新激励数据状态为驳回
            await ctx.service.incentive.incentiveData.updateReviewStatusByIncentiveDataIdBatch(param.incentive_data_ids,review_status_id);
          }
          //更新所属表格审核状态为初审驳回
          if(tables_ids.length>0){
            await ctx.service.incentive.tables.updateReviewStatusByTablesIdBatch(tables_ids,review_status_id);
          }
          for(let i=0,len=param.incentive_data_ids.length;i<len;i++){
            //新增审核记录
            await ctx.service.incentive.reviewRecord.insertReviewRecord({
              incentive_data_id:param.incentive_data_ids[i],
              review_status_id:review_status_id,
              review_status_name:review_status_name,
              review_comment:review_comment,
              user_id:user_id,
              user_account:user_account,
            });
          }

        }else{ //通过
          review_status_id=2;
          review_status_name='初审通过';
          //更新激励数据为初审通过
          if(incentiveDatas.length>0){
            await ctx.service.incentive.incentiveData.updateReviewStatusByIncentiveDataIdBatch(param.incentive_data_ids,review_status_id);
          }
          for(let i=0,len=param.incentive_data_ids.length;i<len;i++){
            //新增审核记录
            await ctx.service.incentive.reviewRecord.insertReviewRecord({
              incentive_data_id:param.incentive_data_ids[i],
              review_status_id:review_status_id,
              review_status_name:review_status_name,
              review_comment:review_comment,
              user_id:user_id,
              user_account:user_account,
            });
          }
          //检查所属表格全部数据是否初审通过
          for(let j=0,jlen=tables_ids.length;j<jlen;j++){
            let tempData = await ctx.service.incentive.incentiveData.getIncentiveDataListByTablesId(tables_ids[j]);
            if(!tempData) tempData=[];
            let isAllOK=true;
            for(let jj=0,jjlen=tempData.length;jj<jjlen;jj++){
              if(tempData[jj].review_status_id!==review_status_id){
                isAllOK=false;
                break;
              }
            }
            //更新所属表格审核状态为初审通过
            if(isAllOK){
              await ctx.service.incentive.tables.updateReviewStatusByTablesId(tables_ids[j],review_status_id);
            }
          }
          
        }
      }
      if(param.reviewType===2){ //终审
        //检查权限
        if(!this.checkHasFinalReviewAuth(userAuths)){
          this.failure('您没有终审权限审核数据！');
          return 0;
        }
        if(param.reviewResultCode===0){ //驳回
          review_status_id=5;
          review_status_name='终审驳回';
          if(incentiveDatas.length>0){ //更新激励数据状态为驳回
            await ctx.service.incentive.incentiveData.updateReviewStatusByIncentiveDataIdBatch(param.incentive_data_ids,review_status_id);
          }
          //更新所属表格审核状态为驳回
          if(tables_ids.length>0){
            await ctx.service.incentive.tables.updateReviewStatusByTablesIdBatch(tables_ids,review_status_id);
          }
          for(let i=0,len=param.incentive_data_ids.length;i<len;i++){
            //新增审核记录
            await ctx.service.incentive.reviewRecord.insertReviewRecord({
              incentive_data_id:param.incentive_data_ids[i],
              review_status_id:review_status_id,
              review_status_name:review_status_name,
              review_comment:review_comment,
              user_id:user_id,
              user_account:user_account,
            });
          }
        }else{ //通过
          review_status_id=4;
          review_status_name='终审通过';
          //更新激励数据为终审通过
          if(incentiveDatas.length>0){
            await ctx.service.incentive.incentiveData.updateReviewStatusByIncentiveDataIdBatch(param.incentive_data_ids,review_status_id);
          }
          for(let i=0,len=param.incentive_data_ids.length;i<len;i++){
            //新增审核记录
            await ctx.service.incentive.reviewRecord.insertReviewRecord({
              incentive_data_id:param.incentive_data_ids[i],
              review_status_id:review_status_id,
              review_status_name:review_status_name,
              review_comment:review_comment,
              user_id:user_id,
              user_account:user_account,
            });
          }
          
          //检查所属表格全部数据是否终审通过
          for(let j=0,jlen=tables_ids.length;j<jlen;j++){
            let tempData = await ctx.service.incentive.incentiveData.getIncentiveDataListByTablesId(tables_ids[j]);
            if(!tempData) tempData=[];
            let isAllOK=true;
            for(let jj=0,jjlen=tempData.length;jj<jjlen;jj++){
              if(tempData[jj].review_status_id!==review_status_id){
                isAllOK=false;
                break;
              }
            }
            //更新所属表格审核状态为终审通过
            if(isAllOK){
              await ctx.service.incentive.tables.updateReviewStatusByTablesId(tables_ids[j],review_status_id);
              //计算这个表格数据 tempData 并更新数据到数据库
              await ctx.service.incentive.calc.calc(tempData);
              //6 完成 更新所属表格的审核状态 
              await ctx.service.incentive.tables.updateReviewStatusByTablesId(tables_ids[j],6);
            }
          }

        }
      }

      this.success({});
    }catch(err){
      ctx.logger.error(err);
      this.failure('信息有误');
    }
  }

}

module.exports = ReviewController;