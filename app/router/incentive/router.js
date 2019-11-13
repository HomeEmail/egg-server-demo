// image_tool业务路由
module.exports = app => {
  const {router,controller,config} = app;
  let customCacheConfig=config.customCache||{};
  let projectRunName=!!config.projectRunName?'/'+config.projectRunName:'';

  router.get(projectRunName+'/',controller.home.index);

  
  router.get(projectRunName+'/api/captcha',controller.captcha.index);
  router.get(projectRunName+'/api/loginKey',controller.loginKey.index);

  router.post(projectRunName+'/api/upload',controller.incentive.upload.up);
  router.post(projectRunName+'/api/importAction',controller.incentive.import.index);
  router.post(projectRunName+'/api/getReviewList',controller.incentive.review.getReviewList);
  router.post(projectRunName+'/api/submitReview',controller.incentive.review.submitReview);
  router.post(projectRunName+'/api/updateReview',controller.incentive.review.updateReview);
  router.post(projectRunName+'/api/getFileList',controller.incentive.file.getFileList);
  router.post(projectRunName+'/api/downloadFile',controller.incentive.file.downloadFile);
  router.get(projectRunName+'/api/downloadFile',controller.incentive.file.downloadFile);
  router.get(projectRunName+'/api/downloadXlsxTpl',controller.incentive.file.downloadXlsxTpl);
  router.post(projectRunName+'/api/getTablesList',controller.incentive.tables.getTablesList);
  router.post(projectRunName+'/api/deleteTablesData',controller.incentive.tables.deleteTablesAndDataByUser);
  router.post(projectRunName+'/api/getTablesDetail',controller.incentive.incentiveData.getTablesDetail);
  router.post(projectRunName+'/api/getReviewDataList',controller.incentive.incentiveData.getReviewDataList);
  router.post(projectRunName+'/api/getResultReportList',controller.incentive.incentiveData.getResultReportList);
  router.post(projectRunName+'/api/exportResultReportList',controller.incentive.incentiveData.exportResultReportList);
  router.get(projectRunName+'/api/exportResultReportList',controller.incentive.incentiveData.exportResultReportList);

  router.post(projectRunName+'/api/login',controller.incentive.user.login);
  router.get(projectRunName+'/api/loginByIboss',controller.incentive.user.loginByIboss);
  router.post(projectRunName+'/api/logout',controller.incentive.user.logout);//


};