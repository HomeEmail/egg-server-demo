const Controller = require('../../core/base_controller');

class GetFileProfix extends Controller {
    async index(){
        try{
            let imageProfix=this.config.imageProfix||'';
            let audioProfix=this.config.audioProfix||'';
            //throw new Error('response status is not 200');//测试异常错误抛出
            this.success({
                audioProfix:audioProfix,
                imageProfix:imageProfix
            });

        }catch(err){
            this.ctx.logger.error(err);
            this.failure('system error!'+err,{audioProfix:'',imageProfix:''});
        }
    }
}
module.exports = GetFileProfix;