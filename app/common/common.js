// 公共基础工具库
const Hashes = require('jshashes');// 加密库
const uuidv1 = require('uuid/v1');// base timestamp
const uuidv4 = require('uuid/v4');// base random
const uuidv5 = require('uuid/v5');// base namespace
const fs = require('fs');
const Hashids = require('hashids');// 加密解密 (短字符串)
const crypto = require('crypto');// nodejs 自带的加解密库
const CryptoJS = require('crypto-js');// 标准的加解密库，和java通信的加解密用这个比较实用

module.exports = {
	encryptByKey(s, key = '1234123412ABCDEF') {
		const ciphertext = CryptoJS.AES.encrypt(s, key).toString();
		return ciphertext;
	},
	decryptByKey(s, key = '1234123412ABCDEF') {
		const bytes = CryptoJS.AES.decrypt(s, key);
		const originalText = bytes.toString(CryptoJS.enc.Utf8);
		return originalText;
	},
	encryptByKeyIv(s, key = '1234123412ABCDEF', iv = 'ABCDEF1234123412') {
		const k = CryptoJS.enc.Utf8.parse(key); // 十六位十六进制数作为秘钥
		const i = CryptoJS.enc.Utf8.parse(iv); // 十六位十六进制数作为秘钥偏移量
		const srcs = CryptoJS.enc.Utf8.parse(s);
		const encrypted = CryptoJS.AES.encrypt(srcs, k, { iv: i, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
		return encrypted.ciphertext.toString().toUpperCase();
	},
	decryptByKeyIv(s, key = '1234123412ABCDEF', iv = 'ABCDEF1234123412') {
		const k = CryptoJS.enc.Utf8.parse(key); // 十六位十六进制数作为秘钥
		const i = CryptoJS.enc.Utf8.parse(iv); // 十六位十六进制数作为秘钥偏移量
		const encryptedHexStr = CryptoJS.enc.Hex.parse(s);
		const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
		const decrypt = CryptoJS.AES.decrypt(srcs, k, { iv: i, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
		const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
		return decryptedStr.toString();
	},
	encrypt(s) {// 加密
		const key = '1234123412ABCDEF';// 你的密钥
		const cipher = crypto.createCipher('aes-256-cbc', key);
		let crypted = cipher.update(s, 'utf8', 'hex');
		crypted += cipher.final('hex');
		return crypted;
	},
	decrypt(s) {// 解密
		const key = '1234123412ABCDEF';// 你的密钥
		const decipher = crypto.createDecipher('aes-256-cbc', key);
		let dec = decipher.update(s, 'hex', 'utf8');
		dec += decipher.final('utf8');
		return dec;
	},
	sha1ByCryptoJS(s) { // 结果和sha1一样
		return CryptoJS.SHA1(s).toString();
	},
	sha1(s) {
		return new Hashes.SHA1().hex(s);
	},
	sha1_b64(s) {
		return new Hashes.SHA1().b64(s);
	},
	sha256(s) {
		return new Hashes.SHA256().hex(s);
	},
	sha512(s) {
		return new Hashes.SHA512().hex(s);
	},
	md5ByCryptoJS(s) { // 结果和md5一样
		return CryptoJS.MD5(s).toString();
	},
	md5(s) {
		return new Hashes.MD5().hex(s);
	},
	uuidv1() {
		return uuidv1();
	},
	uuidv4() {
		return uuidv4();
	},
	uuidv5(s, type) {
		if (type == 'DNS') {
			return uuidv5(s, uuidv5.DNS);
		}
		if (type == 'URL') {
			return uuidv5(s, uuidv5.URL);
		}
		const MY_NAMESPACE = '3a602f20-956f-11e7-99ce-17399588291f';
		return uuidv5(s, MY_NAMESPACE);
	},
	hashids_encode(nums) {// 加密 to 短字符串;s:number||array
		const hashids = new Hashids('garden is your public key', 8);// 最短8位 
		return hashids.encode(nums);
	},
	hashids_decode(s) {// 解密 ; s:string
		const hashids = new Hashids('garden is your public key', 8);// 最短8位 
		return hashids.decode(s);
	},
	b64_encode(s) {
		const b = new Buffer(s);
		const str = b.toString('base64');
		return str;
	},
	b64_decode(s) {
		const b = new Buffer(s, 'base64');
		const str = b.toString();
		return str;
	},
	img2b64(file) {
		//  read binary data
		const bitmap = fs.readFileSync(file);
		//  convert binary data to base64 encoded string
		return new Buffer(bitmap).toString('base64');
	},
	b642img(s, file) {
		try {
			//  create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
			const bitmap = new Buffer(s, 'base64');
			//  write buffer to file
			fs.writeFileSync(file, bitmap);
			console.log('******** File created from base64 encoded string ********');
			return true;
		} catch (err) {
			console.log(err);
			return false;
		}

	}
};









