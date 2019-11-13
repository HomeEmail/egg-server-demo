const Controller = require('../core/base_controller');
const common = require('../common/common');

class LoginKeyController extends Controller {

  /**
   * @api {get} /api/loginKey 登陆密码加密key
   * @apiDescription 登陆密码加密key
   * @apiName loginKey
   * @apiGroup User
   * @apiSuccess {Number} code 1成功 0失败
   * @apiSuccess {String} message 消息
   * @apiSuccess {String} key 加密key
   * @apiVersion 1.0.0
   */  
  async index() {
    const ctx = this.ctx;
    const k = common.uuidv1();
    ctx.session.loginKey = k;
		this.success({ key: k });
  }
}

module.exports = LoginKeyController;