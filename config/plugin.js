//模板引擎
exports.nunjucks = {
	enable:true,
	package:'egg-view-nunjucks'
};
//参数校验
exports.validate = {
	enable:true,
	package:'egg-validate',
};

exports.mysql = {
	enable:true,
	package:'egg-mysql',
};
exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};

//允许跨域配置 //有问题，设置后没法发送session
// exports.cors = {
// 	enable:true,
// 	package:'egg-cors',
// };

//静态文件夹代理
exports.static = {
	enable:true,
};

// exports.redis = {
//   enable: true,
//   package: 'egg-redis',
// };
// exports.sessionRedis = {
//   enable: true,
//   package: 'egg-session-redis',
// };