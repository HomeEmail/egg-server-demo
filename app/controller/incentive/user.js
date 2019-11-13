const Controller = require('../../core/base_controller');
const common = require('../../common/common');

const {getIbossUserinfoSync} = require('../../common/req');
class UserController extends Controller {

	/**
	 * @api {post} /api/login 用户登陆
	 * @apiDescription 用户登陆
	 * @apiName login
	 * @apiGroup User
	 * @apiParam {String} loginName 用户名（必填）
	 * @apiParam {String} passwd 密码（必填）要使用登陆密码加密key加密下
	 * @apiParam {String} verificationCode 验证码（必填）
	 * @apiSuccess {Number} code 1成功 0失败
	 * @apiSuccess {String} message 消息
	 * @apiSuccess {Object} data 数据内容
	 * @apiSuccess {String} data.token 登陆token值
	 * @apiSuccess {String} data.verificationCode 验证码
	 * @apiSuccess {Int} data.user_id 用户id
	 * @apiSuccess {String} data.user_account 用户账号
	 * @apiSuccess {String} data.password 加密密码
	 * @apiSuccess {String} data.user_name 用户姓名
	 * @apiVersion 1.0.0
	 */
	async login() {
		const ctx = this.ctx;
		//获取post过来的参数
		let param = ctx.request.body;
		//console.log('panda.user.login param:',param);
		//创建参数校验规则
		let createRule = {
			loginName: {
				type: 'string',
				required: true,//默认就是true
			},
			passwd: {
				type: 'password',
				required: true,//默认就是true
				min: 6,//密码长度最少6位
				//compare: 're-password',//和此参数对比是否相同
			},
			verificationCode: {
				type: 'string',
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
		if (!!!ctx.session.captcha) {
			this.failure('无验证码，请先生成验证码!');
			return 0;
		}

		if (param.verificationCode.toLowerCase() != ctx.session.captcha.toLowerCase()) {
			this.failure('验证码错误！');
			return 0;
		}
		let pwd = param.passwd;

		const k = ctx.session.loginKey;
		if (!!!k) {
			this.failure('无密码加密key');
			return 0;
		}
		pwd = common.decryptByKey(param.passwd, k);//解密
		ctx.session.loginKey = null;
		delete ctx.session.loginKey;

		let result = await ctx.service.incentive.user.getOneByName(param.loginName);//有数据时返回是个对象，查不到数据时返回是个空数组
		//console.log('service.incentive.user.getOneByName:',result);

		if (!!!result.user_account) {//无此用户
			this.failure('无此用户!');
			return 0;
		}
		//有此用户

		if (result.password != common.sha1(pwd)) {//密码错误
			this.failure('密码错误！');
			return 0;
		}
		let data = Object.assign(
			{
				// verificationCode: ctx.session.captcha,
				// token: common.uuidv1(),
			},
			result
		);
		ctx.session.captcha = null;
		delete ctx.session.captcha;

		ctx.session.userinfo = { user_id: data.user_id, user_account: data.user_account,}; //只保存必要的信息，太多信息的话如果不采用外部存储session就会丢失部分session信息
		delete data.password;
		ctx.session.department_name='';
		let departmentAry = await ctx.service.incentive.department.getUserDepartment(data.user_id);
		if(departmentAry&&departmentAry[0]){
			ctx.session.department_name=departmentAry[0].department_name;
		}
		//console.log('11111');
		//let user_authoritys = await this.get_user_authoritys();
		//console.log(user_authoritys);
		//console.log('22222');
		//delete ctx.session.user_authoritys;
		// ctx.session.user_authoritys=[];
		// let authorityAry = await ctx.service.incentive.authority.getUserAuthority(data.user_id);
		// if(authorityAry){
		// 	ctx.session.user_authoritys=[...authorityAry];
		// }
		//console.log('session',JSON.stringify(ctx.session));
		this.success({ data: data });
	}
	getCookieWithStrByName(str='', name=''){
		const ary = str.split('; ');
		let obj = {};
		ary.forEach(v => {
			let items = v.split('=');
			obj[items[0]] = items[1];
		});
		return obj[name] || '';
	}
	/**
	 * @api {get} /api/loginByIboss iboss用户登陆
	 * @apiDescription iboss用户登陆 获取iboss cookie
	 * @apiName loginByIboss
	 * @apiGroup User
	 * @apiSuccess {Number} code 1成功 0失败
	 * @apiSuccess {String} message 消息
	 * @apiVersion 1.0.0
	 */
	async loginByIboss(){
		const ctx = this.ctx;
		//获取post过来的参数
		// let param = ctx.request.body;
		// let query = ctx.query;
		// console.log(param,query);
		// console.log('cookie',this.ctx.get('Cookie'));
		//const se=ctx.cookies.get('SESSION');
		//console.log('SESSION',se);

		//let seStr = 'SESSION='+se;//SESSION=43e85c2c-1876-4766-8550-dff39efa0af1
		
		//查看来源是否是配置的host
		const referer = this.ctx.get('Referer');
		if(referer.indexOf(this.config.ibossSessionApi.host)<=-1){
			this.failure('不允许此来源,请联系管理员');
			return 0;
		}

		const seStr = this.ctx.get('Cookie');
		//console.log('Cookie',seStr);
		let ibossSessionValue = this.getCookieWithStrByName(seStr, 'SESSION');
		//console.log('ibossSessionValue',ibossSessionValue);
		if(!ibossSessionValue){
			ibossSessionValue = 'a8a4c524-9cc6-4900-97c8-2ba2d6bde567'; //test用
		}
		try{
			// if(ctx.session.userinfo&&ctx.session.userinfo.user_account){
			// 	this.success({data:ctx.session.userinfo,cookie:seStr});
			// 	return;
			// }
			//GET
			//test https://10.41.1.156:8095/bss-login-management/acquireInfoBySession?=2222
			//正式 https://iboss.uniin.cn/bss-login-management/acquireInfoBySession?_=1571901606934

			//POST
		  //test https://10.41.1.156:8093/cop/session/getSessionInfo
		  //正式 https://iboss.uniin.cn:8093/cop/session/getSessionInfo
			
			const ibossSessionMethod = this.config.ibossSessionApi.method;
			const ibossSessionProtocol = this.config.ibossSessionApi.protocol;
			const ibossSessionHost = this.config.ibossSessionApi.host;
			const ibossSessionPath = this.config.ibossSessionApi.path;

			process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
			let res = await getIbossUserinfoSync(ibossSessionMethod,ibossSessionProtocol,ibossSessionHost,ibossSessionPath,'SESSION='+ibossSessionValue);
			//console.log('333333',res);
			const data = JSON.parse(res);
			if(data.sysUserId){
				const privileges = JSON.parse(data.privileges);
				const userObj = data;
				if(userObj.sysUserId){ //有用户信息
					//userObj.sysUserCode//账号
					const user_id=userObj.sysUserId;
					const user_account=userObj.sysUserCode;
					//检查是否有此账号
					let result = await ctx.service.incentive.user.getOneByName(user_account);//有数据时返回是个对象，查不到数据时返回是个空数组
					if (!!!result.user_account) {//无此用户
						await ctx.service.incentive.user.insertUserRecord({
							user_id:user_id,
							user_account:user_account,
							user_name:userObj.staffName,
							password:common.sha1(user_account),
						});
						result={
							user_id:user_id,
							user_account:user_account,
							user_name:userObj.staffName,
						};
					} else { //有此用户
					}
					//权限对比更新
					await this.updateUserAuth(user_id,privileges);
					//创建session
					ctx.session.userinfo = { user_id: user_id, user_account: user_account,}; //只保存必要的信息，太多信息的话如果不采用外部存储session就会丢失部分session信息
					ctx.session.department_name='';
					let departmentAry = await ctx.service.incentive.department.getUserDepartment(user_id);
					if(departmentAry&&departmentAry[0]){
						ctx.session.department_name=departmentAry[0].department_name;
					}
					this.success({data:result,ibossRes:res,cookie:seStr});
				}else{
					//ctx.session=null;
					this.failure('获取iboss用户信息错误',{ibossRes:res,cookie:seStr});
				}
			}else{//获取iboss用户信息错误
				//ctx.session=null;
				this.failure('获取iboss用户信息错误',{ibossRes:res,cookie:seStr});
			}
			
		}catch(err){
			//ctx.session=null;
			ctx.logger.error(err);
			this.failure('获取iboss用户信息错误 '+err);
		}
	}
	async updateUserAuth(user_id,privileges){
		const allAuths = await this.getAllAuthoritys();
		const userAuths = await this.get_user_authoritys(user_id);
		//查找iboss返回的有本系统相关的权限出来
		const aboutPrivs = allAuths.filter(v => privileges.some(vv => vv.privCode===v.authority_code));
		//查找有木有新加的iboss相关权限
		let newAddAuths = [];
		aboutPrivs.forEach(v => {
			if(!userAuths.some(vv => vv.authority_id===v.authority_id)){
				newAddAuths.push(v);
			}
		});
		if(newAddAuths.length>0){
			for(let i=0,len=newAddAuths.length;i<len;i++){
				await this.ctx.service.incentive.authority.insertUserAuthRecord({
					user_id:user_id,
					authority_id:newAddAuths[i].authority_id,
				});
			}
		}
		//查找有木有需要删除的iboss相关权限
		let deleteAuths = [];
		userAuths.forEach(v => {
			if(!aboutPrivs.some(vv => vv.authority_id===v.authority_id)){
				deleteAuths.push(v);
			}
		});
		if(deleteAuths.length>0){
			for(let j=0,jlen=deleteAuths.length;j<jlen;j++){
				await this.ctx.service.incentive.authority.deleteUserAuthRecord({
					user_id:user_id,
					authority_id:deleteAuths[j].authority_id,
				});
			}
		}
	}
	/**
	 * @api {post} /api/logout 用户退出
	 * @apiDescription 用户退出
	 * @apiName logout
	 * @apiGroup User
	 * @apiSuccess {Number} code 1成功 0失败
	 * @apiSuccess {String} message 消息
	 * @apiVersion 1.0.0
	 */
	async logout() {
		const ctx = this.ctx;
		try {
			ctx.session = null;
			this.success();
		} catch (err) {
			this.failure(err.message);
		}

	}

}

module.exports = UserController;