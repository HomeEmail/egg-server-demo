//清除缓存使用
const url = require('url');
//options = {type:'local',outTime:10*60} type:缓存是本地local还是远程redis，outTime：缓存多久单位秒
module.exports = (options,app) => {
    return async function saveAndReadCacheMiddleware(ctx,next) {

        if(!!!app.config.customCache||!!!app.config.customCache.enable){//缓存总开关配置为未启用
            await next();
            return;
        }
        let prekey = app.config.customCache.prekey||'xx';

        let url=ctx.request.url;
        let type=options.type||'local';
        if(!!!type) type='local';

        //let pathname = url.parse(ctx.request.url).pathname;
        console.log('---begin---saveAndReadCache.js url:',url);
        if(type=='redis'){//读取外部redis存储缓存
            let urlResult=await app.redis.get(url);//字符串
            if(!!urlResult){
                let readObj1=JSON.parse(urlResult);
                ctx.body=readObj1.data;
                console.log('读取了redis缓存:',url);
                return 1;
            }
        }else{ //读取本地全局变量缓存
            if(!!app.cache[url]){
                let readObj=JSON.parse(app.cache[url]);
                if(new Date().getTime()<=readObj.disableTime){//没过期
                    ctx.body=readObj.data;
                    console.log('读取了缓存:',url);
                    return 1;
                }
            }
        }
        
        await next(); //获得数据

        //存储相应缓存
        options=options||{};
        let outTime=options.outTime||app.config.customCache.outTime||600;
        
        if(type=='redis'){//外部redis存储缓存
            let data1={
                data:ctx.body
            };
            
            await app.redis.hset(prekey+'urls', url, 1);//散列
            await app.redis.set(url, JSON.stringify(data1));//字符串
            await app.redis.expire(url,outTime);//30秒后过期
            //let hkeys = await app.redis.hkeys(prekey+'urls');//获取散列的所有键
            console.log('保存了redis缓存:',url);
          

        }else{ //本地全局变量缓存
            //console.log('保存缓存内容为:',ctx.body);
            let now=new Date().getTime();
            let num=now.toString().length;
            let data={
                data:ctx.body,
                disableTime:now+(num==13 ? outTime*1000 : outTime)
            };
            app.cache[url]=JSON.stringify(data);
            console.log('保存了缓存:',url);
        }
        
        
        console.log('---saveAndReadCache end--- options:',options);
        //console.log('app:',app);
    }
};