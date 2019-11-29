const path = require('path');
module.exports = appInfo => {
	console.log('config appInfo.baseDir:',appInfo.baseDir);
	return {
		keys:'sb',//cookie安全字符串 
		session : {
			key:'sid', //承载 Session 的 Cookie 键值对名字
			maxAge : 5 * 3600 * 1000, //毫秒 5小时 Session 的最大有效时间
			httpOnly: true,
			encrypt: true,
			renew: true,
		},
		security : { //框架中内置了安全插件 egg-security，提供了一些默认的安全实践，并且框架的安全插件是默认开启的，如果需要关闭其中一些安全防范，直接设置该项的 enable 属性为 false 即可
			// xframe: {
			// 	enable: true,
			// },
			// // csrf: false,
			// csrf : {
			// 	enable: true,
			// 	// useSession: true, // 默认为 false，当设置为 true 时，将会把 csrf token 保存到 Session 中
			// 	// cookieName: 'csrfToken', // Cookie 中的字段名，默认为 csrfToken
			// 	// sessionName: 'csrfToken', // Session 中的字段名，默认为 csrfToken
			// 	// ignoreJSON: true,
			// },
			// csp: true,
			// hsts: true,
			// noopen: true,
			// nosniff: true,
			// xssProtection: true,
			// //domainWhiteList: ['http://127.0.0.1:8080'],// 配置白名单
		},
		// cors: {
		// 	credentials: true,	//客户端请求如果需要保存本地凭条(cookie)，则会带有特别的请求字段 withCredentials，服务端需要同样开启这个字段才能响应这些请求
		// 	origin: 'http://127.0.0.1:8080',//'http://localhost:8080', 	//*允许所有跨域访问，注释掉则允许上面 白名单 访问
		// 	allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
		// 	//maxAge: 1728000,
		// 	//exposeHeaders: 'Set-Cookie',
		// 	//allowHeaders: 'Accept,x-csrf-token,X-Custom-Header,X-Requested-With,Origin, Content-Type, Authorization',
		// },
		// assets : {
		// 	publicPath: '/public/',
		// },
		static: {
			prefix:'/public/', //访问demo http://127.0.0.1:7001/public/apidoc/index.html
			dir: [path.join(appInfo.baseDir, 'app', 'public')],
			dynamic: true, // 如果当前访问的静态资源没有缓存，则缓存静态文件，和`preload`配合使用；
			preload: false,
			maxAge: 31536000, // in prod env, 0 in other envs
			buffer: true, // in prod env, false in other envs
		},
		view : { //模板引擎
			defaultViewEngine: 'nunjucks',
			mapping: {
				'.tpl': 'nunjucks',
			},
		},
		bodyParser : { //请求体配置
			jsonLimit: '100kb', //application/json
		  formLimit: '100kb', //表单 application/x-www-form-urlencoded
		},
		multipart : { //上传文件请求体配置 //浏览器上都是通过 Multipart/form-data 格式发送文件
			fileExtensions: [ '.doc','.docx','.xls','.xlsx','.pdf','.jpeg','.jpg','.png','.zip','.rar','.7z' ], // 增加扩展名的文件支持
			mode:'stream',
		},
		logger : { //日记输出路径配置
			dir: path.join(appInfo.baseDir, 'logs'),
		},
		sequelize : {
			dialect: 'mysql',
			host: '127.0.0.1',
			port: 3306,
			user:'root',
			password:'123456',
			database: 'egg-server-demo',
		},
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

		redis : {
			// client: { //单例
			//     port: 6379,          // Redis port
			//     host: '127.0.0.1',   // Redis host
			//     password: 'auth',
			//     db: 0,
		  	// },
		  	/*clients: { //多例
				foo: {                 // instanceName. See below
					port: 6379,          // Redis port
					host: '127.0.0.1',   // Redis host
					password: 'auth',
					db: 0,
				},
				bar: {
					port: 6379,
					host: '127.0.0.1',
					password: 'auth',
					db: 1,
				},
			},
			client: { //哨兵模式
				sentinels: [{          // Sentinel instances
					port: 26379,         // Sentinel port  
					host: '127.0.0.1',   // Sentinel host  
				}],
				name: 'mymaster',      // Master name
				password: 'auth',
				db: 0
			},*/
			// client: { //集群模式
			// 	cluster: true,
			// 	nodes: [
			// 		{
			// 			host: '172.16.146.32',
			// 			port: '7001',
			// 			family: 'user',
			// 			password: '',
			// 			db: 'db0',
			// 		}, 
			// 		{
			// 			host: '172.16.146.32',
			// 			port: '7002',
			// 			family: 'user',
			// 			password: '',
			// 			db: 'db0',
			// 		}, 
			// 		{
			// 			host: '172.16.146.32',
			// 			port: '7003',
			// 			family: 'user',
			// 			password: '',
			// 			db: 'db0',
			// 		}
			// 	]
			// },
		},

		middleware : [ //在配置众中引入中间件,添加如下中间件，数组顺序即为中间件的加载顺序
			'robot',
			'gzip',
			'auth',
		],
		//框架和插件中使用中间件样例
		//app.config.coreMiddleware.unshift('gzip');
		//router 中使用中间件样例，只想针对单个路由生效，可以直接在 app/router.js 中实例化和挂载
		// const gzip = app.middleware.gzip({ threshold: 1024 });
		// app.router.get('/needgzip', gzip, app.controller.handler);

		// 无论是应用层加载的中间件还是框架自带中间件，都支持几个通用的配置项：
		// enable：控制中间件是否开启。
		// match：设置只有符合某些规则的请求才会经过这个中间件。
		// ignore：设置符合某些规则的请求不经过这个中间件。

		//robot's configurations 禁止哪些爬虫访问
		robot : {
			enable:false,//是否启用
			ua:[
				/Baiduspider/i
			]
		},
		//gzip 中间件配置
		gzip : {
			enable:false,//是否启用
			threshold:512, // 小于 0.5k 的响应体不压缩
		},
		auth : {
			enable:true,//是否启用
			//noneedLoginUrls:['/','/api/login','/api/logout','/api/captcha','/api/loginKey'],
			noneedLoginUrls : ['/','/login','/logout','/captcha','/loginKey'],
		},


		projectRunName:'',//项目名称 将自动拼接到接口路径上 比如http://xx.com/[projectRunName]/api/getuser
		customCache:{ //自己定义的缓存中间件配置 包含clearCache.js saveAndReadCache.js 
			enable:true,//是否启用 总开关
			type:'local',//local or redis
			outTime:10*60,//缓存多久单位秒,优先级小于路由里配置的outTime，如个别路由缓存时间不一样请在路由里设置
			prekey:'incentive_',//redis key的前缀
		},
		
		//后端上传文件路径前缀
		uploadBasePath:path.join(appInfo.baseDir,'upload'),
		
		//前端读取图片路径前缀
		imageProfix:'http://1.1.1.1:81/xx/uploadFile/image/',
		//前端读取音频路径前缀
		audioProfix:'http://1.1.1.1:81/xx/uploadFile/audio/',
		//前端读取视频路径前缀
		videoProfix:'http://1.1.1.1:81/xx/uploadFile/video/',
		//前端读取文件路径前缀
		fileProfix:'http://1.1.1.1:81/xx/uploadFile/file/',
	};
};


