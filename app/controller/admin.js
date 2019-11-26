const Controller = require('../core/base_controller');

class UserController extends Controller {
	// 下面是使用egg-sequelize mysql2的例子
	async index() {
		const users = await this.ctx.model.Admin.findAll();
		this.success({ data: users });
	}

	// 下面是使用egg-mysql的例子
	async create() {
		const ctx = this.ctx;
		// console.log('cookie',this.ctx.cookies);
		// console.log('session',this.ctx.session);

		const result = await ctx.service.admin.create();

		this.success({ data: result });

	}
	async getOne() {
		const ctx = this.ctx;
		const result = await ctx.service.admin.getOne();

		this.success({ data: result });

	}
	async getByPage() { // 分页查询demo
		const ctx = this.ctx;
		let { pageNo, pageSize } = ctx.query;// 获取到的是字符串型
		if (pageNo) {
			pageNo = parseInt(pageNo, 10);
		} else {
			pageNo = 1;
		}
		if (pageSize) {
			pageSize = parseInt(pageSize, 10);
		} else {
			pageSize = 20;
		}
		// 创建参数校验规则
		const createRule = {
			pageNo: {
				type: 'int',
				required: false, // 默认就是true
				default: 1,
			},
			pageSize: {
				type: 'int',
				required: false, // 默认就是true
				default: 20,
			},
		};
		//  校验 `ctx.request.body` 是否符合我们预期的格式
		//  如果参数校验未通过，将会抛出一个 status = 422 的异常
		// debugger;
		try {
			ctx.validate(createRule, { pageNo, pageSize });
		} catch (err) {
			// ctx.logger.warn(err.message);
			this.failure('参数有误！');
			return 0;
		}
		const result = await ctx.service.admin.getByPage(pageNo || 1, pageSize || 10);
		this.success({ ...result });
	}
	async getAll() {
		const ctx = this.ctx;
		const result = await ctx.service.admin.getAll();

		this.success({ data: result });

	}
	async getByWhere() {
		const ctx = this.ctx;
		const result = await ctx.service.admin.getByWhere();

		this.success({ data: result });

	}
	async update() {
		const ctx = this.ctx;
		const result = await ctx.service.admin.update();

		this.success({ data: result });

	}
	async del() {
		const ctx = this.ctx;
		const result = await ctx.service.admin.del();

		this.success({ data: result });

	}
	async login() {
		const ctx = this.ctx;

		ctx.session.userinfo = { admin_name: '小明', admin_id: 22, admin_account: 'lcb33' };

		this.success({ data: ctx.session.userinfo });
	}
	async logout() {
		const ctx = this.ctx;
		ctx.session = null;
		ctx.body = '你已退出登陆';
	}

}

module.exports = UserController;