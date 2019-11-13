// const path = require('path');
module.exports = appInfo => {
	console.log('config appInfo.baseDir:',appInfo.baseDir);
	return {
    mysql : {
			clients:{
				// clientId, 获取client实例，需要通过 app.mysql.get('clientId') 获取
				db1:{
					host:'localhost',
					port:'3306',
					user:'root',
					password:'123456',
					database:'egg-server-demo',
				}
			},
			// 所有数据库配置的默认值
			default:{
				
			},
			//是否加载到 app 上，默认开启
			app:true,
			//是否加载到 agent 上，默认关闭
			agent:false,
    },
    
  };
};
