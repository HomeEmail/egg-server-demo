//清除缓存使用
const url = require('url');
//options = {urls:['接口地址','接口地址'],type:'local'}
module.exports = (options,app) => {
    return async function clearCacheMiddleware(ctx,next) {

        if(!!!app.config.customCache||!!!app.config.customCache.enable){//缓存总开关配置为未启用
            await next();
            return;
        }
        let prekey = app.config.customCache.prekey||'xx';

        let pathname = url.parse(ctx.request.url).pathname;
        console.log('---begin---clearCache.js pathname:',pathname);
        
        await next(); //等待数据更新完成
        //清除相应缓存
        options=options||{};
        let urls=options.urls||[];
        let type=options.type||'local';
        if(!!!type) type='local';
        
        if(urls.length>0){
            
            for(let i=0,len=urls.length;i<len;i++){
                //console.log('url:',urls[i]);

                if(type=='redis'){//外部redis存储缓存
                    if(!!!app.redis) continue;
                    //await app.redis.set('foo', 'bar');//字符串
                    //await app.redis.expire('foo',30);//30秒后过期
                    //await app.redis.hset('hash-key', 'sub-key', 'value');//散列
                    let hkeys = await app.redis.hkeys(prekey+'urls');//获取散列的所有键
                    if(!!hkeys&&hkeys.length>0){
                        for(let j=0,lenn=hkeys.length;j<lenn;j++){
                            if(hkeys[j].indexOf(urls[i])>-1){ //命中缓存
                                await app.redis.del(hkeys[j]);//删除对应url字符串缓存
                                await app.redis.hdel(prekey+'urls',hkeys[j]);//散列里的对应key
                                //flushdb 清空当前数据库
                                console.log('删除了redis缓存:',hkeys[j]);
                            }
                        }
                    }
                }else{ //本地全局变量缓存
                    if(!!!app.cache) continue;
                    for(let key in app.cache){
                        if(key.indexOf(urls[i])>-1){ //命中缓存
                            delete app.cache[key];//删除
                            console.log('删除了缓存:',key);
                        }
                    }
                }
                
            }
        }
        
        console.log('---clearCache end--- options:',options);
        //console.log('app:',app);
    }
};