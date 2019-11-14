module.exports = app => {
	const {router,controller,config} = app;
	let projectRunName=!!config.projectRunName?'/'+config.projectRunName:'';
	
	router.get(projectRunName+'/',controller.home.index);
	router.get(projectRunName+'/news',controller.news.list);

	router.get(projectRunName+'/upload',controller.upload.index);
	router.post(projectRunName+'/upload',controller.upload.up);

	router.get(projectRunName+'/captcha',controller.captcha.index);
	router.get(projectRunName+'/loginKey',controller.loginKey.index);
	router.get(projectRunName+'/login',controller.admin.login);
	router.get(projectRunName+'/logout',controller.admin.logout);

	router.get(projectRunName+'/admin',controller.admin.index);

	router.get(projectRunName+'/admin/create',controller.admin.create);
	router.get(projectRunName+'/admin/getOne',controller.admin.getOne);
	router.get(projectRunName+'/admin/getByPage',controller.admin.getByPage);
	router.get(projectRunName+'/admin/getAll',controller.admin.getAll);
	router.get(projectRunName+'/admin/getByWhere',controller.admin.getByWhere);
	router.get(projectRunName+'/admin/update',controller.admin.update);
	router.get(projectRunName+'/admin/del',controller.admin.del);

	//这里可以引入其他路由集合
	//require('./router/incentive/router')(app);

};