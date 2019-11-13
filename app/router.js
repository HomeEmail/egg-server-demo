module.exports = app => {
	const {router,controller,config} = app;
	let projectRunName=!!config.projectRunName?'/'+config.projectRunName:'';
	
	router.get(projectRunName+'/',controller.home.index);
	router.get(projectRunName+'/news',controller.news.list);

	router.get(projectRunName+'/upload',controller.upload.index);
	router.post(projectRunName+'/upload',controller.upload.up);

	router.get(projectRunName+'/captcha',controller.captcha.index);
	router.get(projectRunName+'/loginKey',controller.loginKey.index);
	router.get(projectRunName+'/login',controller.user.login);
	router.get(projectRunName+'/logout',controller.user.logout);

	router.get(projectRunName+'/user',controller.user.getAll);
	router.get(projectRunName+'/user/new',controller.user.create);
	router.get(projectRunName+'/user/getOne',controller.user.getOne);
	router.get(projectRunName+'/user/getAll',controller.user.getAll);
	router.get(projectRunName+'/user/getByWhere',controller.user.getByWhere);
	router.get(projectRunName+'/user/update',controller.user.update);
	router.get(projectRunName+'/user/del',controller.user.del);

	//这里可以引入其他路由集合
	//require('./router/incentive/router')(app);

};