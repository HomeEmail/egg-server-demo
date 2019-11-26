// 自定义Controller基类
// 更好的对 Controller 层代码进行抽象（例如将一些统一的处理抽象成一些私有方法）,如封装成功和失败的返回数据格式，还可以通过自定义 Controller 基类的方式封装应用中常用的方法。

// 此时在编写应用的 Controller 时，可以继承 BaseController，直接使用基类上的方法：
/*
const Controller = require('../core/base_controller');
class PostController extends Controller {
  async list() {
    const posts = await this.service.listByUser(this.user);
    this.success(posts);
  }
}
*/
const { Controller } = require('egg');

class BaseController extends Controller {
	get user() {
		return this.ctx.session.userinfo || {};
	}
	get user_department_name() {
		return this.ctx.session.department_name;
	}
	async get_user_authoritys(user_id) {
		// console.log('get user_authoritys',this.user);
		const authorityAry = await this.ctx.service.incentive.authority.getUserAuthority(user_id || this.user.user_id);
		return authorityAry || [];
		// return this.ctx.session.user_authoritys||[];
	}
	async getAllAuthoritys() {
		const authorityAry = await this.ctx.service.incentive.authority.getAllAuthorityList();
		return authorityAry || [];
	}
	checkHasRootAuth(authorityAry = []) {
		return this.checkHasThisDepartmentAuth(authorityAry, '超级管理员权限');
	}
	checkHasViewAlldataResultAuth(authorityAry = []) {
		return this.checkHasThisDepartmentAuth(authorityAry, '查看全量数据结果报表权限');
	}
	checkHasFirstReviewAuth(authorityAry = []) {
		return this.checkHasThisDepartmentAuth(authorityAry, '初审权限');
	}
	checkHasFinalReviewAuth(authorityAry = []) {
		return this.checkHasThisDepartmentAuth(authorityAry, '终审权限');
	}
	checkHasThisDepartmentAuth(authorityAry = [], department_name = '') {
		if (authorityAry.some(v => v.authority_name.indexOf(department_name) > -1)) {
			return true;
		}
		return false;
	}

	success(data) { // 成功返回，正常
		this.ctx.body = {
			code: 1,
			message: 'success',
			...data, // 扩展符（对象和数组）对象的话相当于：Object.assign({}, bar);
		};
	}

	failure(msg, data) { // 失败返回，异常
		this.ctx.body = {
			code: 0,
			message: msg || 'error',
			...data,
		};
	}

	custom(data) { // 自定义返回
		this.ctx.body = Object.assign({}, data);
	}

	notFound(msg) {
		msg = msg || 'not found';
		this.ctx.throw(404, msg);
	}
}
module.exports = BaseController;

