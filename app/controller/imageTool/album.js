const Controller = require('../../core/base_controller');
const common = require('../../common/common');
class AlbumController extends Controller {
    async getUserAlbum() {
        const ctx = this.ctx;
        //获取post过来的参数
        //let param = ctx.request.body;
        let result = await ctx.service.imageTool.album.getUserAlbum();
        
        this.success({ data: result||[] });
    }
    async insertAlbumRecord() {
        const ctx = this.ctx;
        //获取post过来的参数
        let param = ctx.request.body;
        //创建参数校验规则
        let createRule = {
            name: {
                type: 'string',
                required: true,//默认就是true
            },
            comment: {
                type: 'string',
                required: false,//默认就是true
                default: '',
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
        const insertId = await ctx.service.imageTool.album.insertAlbumRecord(param);
        if(!!insertId){
            this.success({ data: {id:insertId} });
        } else {
            this.failure('插入相册失败！');
        }
    }
}

module.exports = AlbumController;