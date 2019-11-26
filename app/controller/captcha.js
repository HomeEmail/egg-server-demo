const Controller = require('../core/base_controller');// require('egg').Controller;
const svgCaptcha = require('svg-captcha');

class CaptchaController extends Controller {
	/**
   * @api {get} /api/captcha 获取验证码
   * @apiDescription 获取验证码
   * @apiName captcha
   * @apiGroup Common
	 * @apiSuccess {Number} code 1成功 0失败
   * @apiSuccess {String} message 消息
   * @apiSuccess {String} data 图片数据svg字符串
   * @apiVersion 1.0.0
   */
	async index() { // 获得验证码
		const ctx = this.ctx;

		const c = svgCaptcha.create({ // 普通验证码
			size: 4,
			noise: 1,
			color: true,
			background: '#dddddd',
			width: 80,
			height: 40,
			fontSize: 40
		}); // 返回 {data: '<svg.../svg>', text: 'abcd'}

		//  const cc=svgCaptcha.createMathExpr({ // 算术验证码
		//  	size:4,
		//  	noise:2,
		//  	color:true,
		//  	background:'#dddddd',
		//  	width:80,
		//  	height:40,
		//  	fontSize:26
		//  });

		//  Access-Control-Allow-Credentials: true
		//  Access-Control-Allow-Headers: authorization
		//  Access-Control-Allow-Methods: GET,HEAD,PUT,POST,DELETE,PATCH
		//  Access-Control-Allow-Origin: *
		//  ctx.set('Access-Control-Allow-Credentials',true);
		//  ctx.set('Access-Control-Allow-Headers','authorization');
		//  ctx.set('Access-Control-Allow-Methods','GET,HEAD,PUT,POST,DELETE,PATCH');
		//  ctx.set('Access-Control-Allow-Origin','*');

		console.log('captcha', c.text.toLowerCase());
		ctx.session.captcha = c.text.toLowerCase();
		// ctx.set('Content-Type', 'image/svg+xml;charset=UTF-8');
		// ctx.body = c.data;
		// console.log('ctx.cookies.get sid');
		this.success({ data: c.data });
	}
}

module.exports = CaptchaController;