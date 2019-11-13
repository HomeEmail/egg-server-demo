const Controller = require('../../core/base_controller');
const common = require('../../common/common');
class UserController extends Controller {
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

        let result = await ctx.service.panda.user.getOneByName(param.loginName);//有数据时返回是个对象，查不到数据时返回是个空数组
        //console.log('service.panda.user.getOneByName:',result);

        if (!!!result.loginName) {//无此用户
            this.failure('无此用户!');
            return 0;
        }
        //有此用户

        if (result.passwd != common.md5(param.passwd)) {//密码错误
            this.failure('密码错误！');
            return 0;
        }

        let sysRoleList = await ctx.service.panda.user.getAuthority(result.pkId);//获取此用户的角色权限列表


        let data = Object.assign(
            {
                verificationCode: ctx.session.captcha,
                token: common.uuidv1(),
                sysRoleList: sysRoleList,
            },
            result
        );
        ctx.session.userinfo = { loginName: data.loginName, token: data.token }; //只保存必要的信息，太多信息的话如果不采用外部存储session就会丢失部分session信息

        this.success({ data: data });
    }
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