const Controller = require('../core/base_controller');

class UserController extends Controller {
	//下面是使用egg-sequelize mysql2的例子
	async index() {
    const users = await this.ctx.model.Admin.findAll();
    this.success({data:users});
  }

	//下面是使用egg-mysql的例子
	async create(){
		const ctx=this.ctx;
		//console.log('cookie',this.ctx.cookies);
		//console.log('session',this.ctx.session);

		const result=await ctx.service.admin.create();
		
		this.success({data:result});

	}
	async getOne(){
		const ctx=this.ctx;
		const result=await ctx.service.admin.getOne();
		
		this.success({data:result});

	}
	async getAll(){
		const ctx=this.ctx;
		const result=await ctx.service.admin.getAll();
		
		this.success({data:result});

	}
	async getByWhere(){
		const ctx=this.ctx;
		const result=await ctx.service.admin.getByWhere();
		
		this.success({data:result});

	}
	async update(){
		const ctx=this.ctx;
		const result=await ctx.service.admin.update();
		
		this.success({data:result});

	}
	async del(){
		const ctx=this.ctx;
		const result=await ctx.service.admin.del();
		
		this.success({data:result});

	}
	async login(){
		const ctx=this.ctx;

		ctx.session.userinfo={admin_name:'小明',admin_id:22,admin_account:'lcb33'};

		this.success({data:ctx.session.userinfo});
	}
	async logout(){
		const ctx=this.ctx;
		ctx.session=null;
		ctx.body='你已退出登陆';
	}

}

module.exports = UserController;