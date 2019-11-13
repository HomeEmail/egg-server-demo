const Controller = require('egg').Controller;

class HomeController extends Controller {
	async index(){
		const ctx=this.ctx;
		//console.log('cookie',this.ctx.cookies);
		//console.log('session',this.ctx.session);

		// let count = ctx.cookies.get('count');
	    // count = count ? parseInt(count,10) : 0;
	    // count++;
	    // ctx.cookies.set('count', count); //只有明确使用set设置的cookie才能用get获取到

		//ctx.session.visited = ctx.session.visited ? ++ctx.session.visited : 1;
		//设置了session 在cookie里就有个加密的键值对key是sid

		this.ctx.body = '------Hello world!-------';// count:'+count+' ctx.session.visited:'+ctx.session.visited+' captcha:'+ctx.session.captcha;

	}
}

module.exports = HomeController;