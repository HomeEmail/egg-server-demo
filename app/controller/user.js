const Controller = require('egg').Controller;

class UserController extends Controller {
	async create(){
		const ctx=this.ctx;
		//console.log('cookie',this.ctx.cookies);
		//console.log('session',this.ctx.session);

		const result=await ctx.service.user.create();
		
		this.ctx.body = result;

	}
	async getOne(){
		const ctx=this.ctx;
		const result=await ctx.service.user.getOne();
		
		this.ctx.body = result;

	}
	async getAll(){
		const ctx=this.ctx;
		const result=await ctx.service.user.getAll();
		
		this.ctx.body = result;

	}
	async getByWhere(){
		const ctx=this.ctx;
		const result=await ctx.service.user.getByWhere();
		
		this.ctx.body = result;

	}
	async update(){
		const ctx=this.ctx;
		const result=await ctx.service.user.update();
		
		this.ctx.body = result;

	}
	async del(){
		const ctx=this.ctx;
		const result=await ctx.service.user.del();
		
		this.ctx.body = result;

	}
	async login(){
		const ctx=this.ctx;

		ctx.session.userinfo={name:'小明',id:22,roleId:32};

		ctx.body=ctx.session.userinfo;
	}
	async logout(){
		const ctx=this.ctx;
		ctx.session=null;
		ctx.body='你已退出登陆';
	}

}

module.exports = UserController;