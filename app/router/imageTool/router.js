// image_tool业务路由
module.exports = app => {
  const {router,controller,config} = app;
  let customCacheConfig=config.customCache||{};
  let projectRunName=!!config.projectRunName?'/'+config.projectRunName:'';
  // router.get(projectRunName+'/',controller.home.index);
  router.get(projectRunName+'/api/captcha',controller.captcha.index);
  router.get(projectRunName+'/api/loginKey',controller.loginKey.index);

  router.post(projectRunName+'/api/upload',controller.imageTool.upload.up);

  router.post(projectRunName+'/api/insertAlbumRecord',controller.imageTool.album.insertAlbumRecord);
  router.get(projectRunName+'/api/getUserAlbum',controller.imageTool.album.getUserAlbum);
  
  router.get(projectRunName+'/api/getUserImages',controller.imageTool.images.getUserImages);
  router.get(projectRunName+'/api/getImageColors',controller.imageTool.images.getImageColors);
  router.get(projectRunName+'/api/getImagesByColor',controller.imageTool.images.getImagesByColor);
  router.post(projectRunName+'/api/updateImageAlbum',controller.imageTool.images.updateImageAlbum);
  
  router.post(projectRunName+'/api/login',controller.imageTool.user.login);
  router.post(projectRunName+'/api/logout',controller.imageTool.user.logout);// /system/user/logout.utvgo

};