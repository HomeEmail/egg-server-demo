const Controller = require('../../core/base_controller');
// const common = require('../../common/common');
class ImagesController extends Controller {
    async getUserImages() {
        const ctx=this.ctx;
		//获取get过来的参数
        let param = ctx.query;
        //创建参数校验规则
        let createRule = {
            label_id: {
                type: 'int',
                convertType:'int',
                required: false,//默认就是true
                default:0,
            },
            album_id: {
                type: 'int',
                convertType:'int',
                required: false,//默认就是true
                default:0,
            },
            pageNo: {
                type: 'int',
                convertType:'int',
                required: false,//默认就是true
                default:1,
            },
            pageSize: {
                type: 'int',
                convertType:'int',
                required: false,//默认就是true
                default:50,
            },
        };
        
        if(!!!param.pageNo||param.pageNo<=0) param.pageNo=1;
        if(!!!param.pageSize||param.pageSize<=0) param.pageSize=50;

        // 校验 `ctx.query` 是否符合我们预期的格式
        // 如果参数校验未通过，将会抛出一个 status = 422 的异常
        try{
            ctx.validate(createRule, param);
        }catch(err){
            ctx.logger.warn(err.message);
            this.failure('参数有误！');
            return 0;
        }
        let user_id=ctx.session.userinfo.userId;

        let totalCountObj=await ctx.service.imageTool.images.getUserImageTotalCount(user_id,param.label_id,param.album_id);
        let result = await ctx.service.imageTool.images.getUserImages(user_id,param.label_id,param.album_id,param.pageNo,param.pageSize);
        //console.log('getUserImages:',result);

        let totalCount=!!totalCountObj[0] ? (totalCountObj[0].totalCount||0) : 0;

        this.success({
            data:result,
            count:totalCount,
            pageNo:param.pageNo,
            pageSize:param.pageSize,
            totalPage:Math.ceil(totalCount/param.pageSize)
        });
    }
    async getImageColors() {
        const ctx=this.ctx;
		//获取get过来的参数
        let param = ctx.query;
        //创建参数校验规则
        let createRule = {
            images_id: {
                type: 'int',
                convertType:'int',
                required: true,//默认就是true
                default:0,
            },
        };
        // 校验 `ctx.query` 是否符合我们预期的格式
        // 如果参数校验未通过，将会抛出一个 status = 422 的异常
        try{
            ctx.validate(createRule, param);
        }catch(err){
            ctx.logger.warn(err.message);
            this.failure('参数有误！');
            return 0;
        }
        let result = await ctx.service.imageTool.images.getImageColors(param.images_id);
        //console.log('getImageColors:',result);

        this.success({
            data:result,
        });
    }
    async getImagesByColor(){
        const ctx=this.ctx;
		//获取get过来的参数
        let param = ctx.query;
        //创建参数校验规则
        let createRule = {
            h: {
                type: 'int',
                convertType:'int',
                required: true,//默认就是true
                default:0,
            },
            s: {
                type: 'number',
                convertType:'number',
                required: true,//默认就是true
                default:0,
            },
            v: {
                type: 'number',
                convertType:'number',
                required: true,//默认就是true
                default:0,
            },
            weights: {
                type: 'int',
                convertType:'int',
                required: true,//默认就是true
                default:2,
            },
            hOffset: {
                type: 'int',
                convertType:'int',
                required: false,//默认就是true
                default:20,
            },
            sOffset: {
                type: 'number',
                convertType:'number',
                required: false,//默认就是true
                default:0.05,
            },
            vOffset: {
                type: 'number',
                convertType:'number',
                required: false,//默认就是true
                default:0.05,
            },
        };
        // 校验 `ctx.query` 是否符合我们预期的格式
        // 如果参数校验未通过，将会抛出一个 status = 422 的异常
        try{
            ctx.validate(createRule, param);
        }catch(err){
            ctx.logger.warn(err.message);
            this.failure('参数有误！');
            return 0;
        }
        let user_id=ctx.session.userinfo.userId;
        param.user_id=user_id;
        let result = await ctx.service.imageTool.images.getImagesByColor(param);
        //console.log('getImagesByColor:',result);

        this.success({
            data:result,
            count:result.lenght,
            pageNo:1,
            pageSize:result.lenght,
            totalPage:1
        });
    }
    async updateImageAlbum(){
        const ctx = this.ctx;
        //获取post过来的参数
        let param = ctx.request.body;
        //创建参数校验规则
        let createRule = {
            id: {
                type: 'int',
                required: true,//默认就是true
                convertType:'int',
            },
            album_id: {
                type: 'int',
                required: true,//默认就是true
                convertType:'int',
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
        const updateResult = await ctx.service.imageTool.images.updateImageAlbum(param.id, param.album_id);
        if(!!updateResult){
            this.success({ data: {} });
        } else {
            this.failure('更新图片所属相册失败！');
        }
    }

}

module.exports = ImagesController;