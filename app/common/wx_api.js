const config = require('../conf/wx');
const request = require('request');
const common = require('./common');
const path = require('path');
const fs = require('fs');
const Promise = require('bluebird');// promise 库
const accessTokenJson = require('../conf/wx_access_token');

module.exports = {
	// 获取token;有效期7200秒，开发者必须在自己的服务全局缓存access_token
	/*
	resolve:函数参数('token') 
	reject:函数参数({})
	*/
	getToken() {
		return new Promise(function (resolve, reject) {
			const tokenUrl = 'https:// api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appId=' + config.appId + '&secret=' + config.appSecret;
			// 获取当前时间 
			const currentTime = new Date().getTime();
			if (accessTokenJson.access_token === '' || accessTokenJson.expires_time < currentTime) {
				// if(accessTokenJson.access_token === "" ){
				request.get(tokenUrl, function (error, response, body) {
					if (error) {
						reject(error);
					} else {
						try {
							const result = JSON.parse(body);
							accessTokenJson.access_token = result.access_token;
							accessTokenJson.expires_time = new Date().getTime() + (parseInt(result.expires_in, 10) - 200) * 1000;
							// 更新本地存储的
							fs.writeFile(path.join(path.resolve(__dirname, '..'), 'conf', 'wx_access_token.json'), JSON.stringify(accessTokenJson));

							resolve(accessTokenJson.access_token);
						} catch (e) {
							reject(e);
						}
					}
				});
			} else {
				// 将本地存储的 access_token 返回
				resolve(accessTokenJson.access_token);
			}

		});
	},
	/*
	setToken:function(){// test
			accessTokenJson.access_token = new Date().getTime()+'';
			accessTokenJson.expires_time = new Date().getTime() + (parseInt(5000,10) - 200) * 1000;
			fs.writeFile(path.join(path.resolve(__dirname,'..'),'conf','wx_access_token.json'),JSON.stringify(accessTokenJson));
			return accessTokenJson;
		  
	},
	*/
	// 获取ticket; 有效期7200秒，开发者必须在自己的服务全局缓存jsapi_ticket
	/*
	resolve:函数参数('ticket') 
	reject:函数参数({})
	*/
	getTicket(token) {
		return new Promise(function (resolve, reject) {
			const ticket_url = 'https:// api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + token + '&type=jsapi';
			request.get(ticket_url, function (error, res, body) {
				if (error) {
					reject(error);
				} else {
					try {
						const ticket = JSON.parse(body).ticket;
						resolve(ticket);
					} catch (e) {
						reject(e);
					}
				}
			});
		});
	},
	// 生成JS-SDK权限验证的签名了
	/*
			ticket
			url:需要签名的页面地址;不包含#及其后面部分
			resolve:函数参数({
									appId: config.appId,
									timestamp: timestamp,
									nonceStr: noncestr,
									signature: signature
							}) 
			reject:函数参数({})
	*/
	getSignature(ticket, url) {
		return new Promise(function (resolve, reject) {
			try {
				const timestamp = parseInt(new Date().getTime() / 1000) + '';
				const noncestr = Math.random().toString(36).substr(2, 15);
				const str = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url;
				// console.log(str);
				const signature = common.sha1(str);// crypto.createHash('sha1').update(str).digest('hex');
				resolve({
					appId: config.appId,
					timestamp,
					nonceStr: noncestr,
					signature
				});
			} catch (err) {
				reject(err);
			}
		});
	}


};