var request = require("request");

exports.getIbossUserinfoSync = function (method='GET', protocol='http://', host='', path='', cookie='') {
  const url = protocol+host+path+'?_='+Date.now();
  return new Promise(function (resolve, reject) {
    var options = {
      method: method||'GET',
      url: url||'https://10.41.1.156:8095/bss-login-management/acquireInfoBySession',
      headers: {
        'cache-control': 'no-cache',
        'Connection': 'keep-alive',
        'Accept-Encoding': 'gzip, deflate, br',
        'Host': host||'10.41.1.156:8095',
        'Cache-Control': 'no-cache',
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
        'Cookie': cookie||'SESSION=c971e1db-3943-4d0f-a351-5d4eb1b23e10'
      },
      timeout: 20000,//毫秒
    };
    request(options, function (error, response, body) {
      if (error) reject(error);;
      resolve(body);
    });
  });
};
