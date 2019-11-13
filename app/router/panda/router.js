//panda业务路由

module.exports = app => {
  const { router, controller, config } = app;
  let customCacheConfig = config.customCache || {};
  let projectRunName = !!config.projectRunName ? '/' + config.projectRunName : '';
  router.get(projectRunName + '/system/verificationCode/getCode.utvgo', controller.captcha.index);
  router.post(projectRunName + '/system/uploadFile/image.utvgo', controller.panda.upload.up);// /system/uploadFile/image.utvgo?file
  router.get(projectRunName + '/system/uploadFile/getFileProfix.utvgo', controller.panda.getFileProfix.index);

  router.post(projectRunName + '/system/user/login.utvgo', controller.panda.user.login);
  router.post(projectRunName + '/system/user/logout.utvgo', controller.panda.user.logout);// /system/user/logout.utvgo

  router.get(projectRunName + '/ui/tv/record/types.utvgo', controller.panda.tvIndex.getMenuTypes);// /ui/tv/record/types.utvgo?platformId=0
  const saveAndReadCache = app.middleware.saveAndReadCache({ type: customCacheConfig.type, outTime: 10 * 60 }, app);//type是表示缓存用本地local还是远程redis outTime表示缓存多久单位秒
  router.get(projectRunName + '/ui/tv/record/page.utvgo', saveAndReadCache, controller.panda.tvIndex.getPageDatas);// /ui/tv/record/page.utvgo?typeId=1
  router.get(projectRunName + '/ui/tv/record/list.utvgo', saveAndReadCache, controller.panda.tvIndex.getPageRecordList);// /ui/tv/record/list.utvgo?templateId=1&typeId=1&number=1&pageNo=1&pageSize=10


  const clearCache = app.middleware.clearCache({ urls: [projectRunName + '/ui/tv/record/page.utvgo', projectRunName + '/ui/tv/record/list.utvgo'], type: customCacheConfig.type }, app);//urls数组里匹配到有此关键字路径都会清除，type是表示缓存用本地local还是远程redis
  router.get(projectRunName + '/ui/tv/record/insert.utvgo', clearCache, controller.panda.tvIndex.insertPageRecord);// ui/tv/record/insert.utvgo?priority=&name=&href=&imgUrl=&typeId=1&number=2&vodId=&ableTime=2019-02-14+09:20:28&disableTime=2021-02-26+09:20:30&templateId=1
  router.get(projectRunName + '/ui/tv/record/audite.utvgo', clearCache, controller.panda.tvIndex.auditePageRecord);// /ui/tv/record/audite.utvgo?id=109&status=1
  router.get(projectRunName + '/ui/tv/record/delete.utvgo', clearCache, controller.panda.tvIndex.deletePageRecord);// /ui/tv/record/delete.utvgo?id=109
  router.get(projectRunName + '/ui/tv/record/update.utvgo', clearCache, controller.panda.tvIndex.updatePageRecord);// /ui/tv/record/update.utvgo?id=14&name=&typeId=1&number=1&priority=0&imgUrl=&vodId=&href=&ableTime=2018-02-25+21:22:32&disableTime=2099-02-25+21:22:32&typeName=&templateId=1


};