const Controller = require('egg').Controller;

class NewsController extends Controller{
	async list(){
		//静态数据
		const dataList = {
			list : [
				{id:1,title:'this is new 1',url:'/news/1',time:1540308345},
				{id:2,title:'this is new 2',url:'/news/2',time:1540309345}
			]
		};

		console.log('app.config.env',this.app.config.env);
		
		//打印日记
		this.logger.debug('current user: %j','ivan');
		await this.ctx.render('news/list.tpl',dataList);
		
		//动态数据
		// const ctx = this.ctx;
		// const page = ctx.query.page || 1;
		// const newsList = await ctx.service.news.list(page);
		// await ctx.render('news/list.tpl',{list:newsList});
	}
}

module.exports = NewsController;

