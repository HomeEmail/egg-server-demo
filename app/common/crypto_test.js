// 测试nodejs的自带加密模块，加密知识涉及 des 3des ecb cbc等。请另外查阅了解
const crypto = require('crypto');

function test_des(param) {
	const key = new Buffer(param.key);
	const iv = new Buffer(param.iv ? param.iv : 0);
	const plaintext = param.plaintext;
	const alg = param.alg;
	const autoPad = param.autoPad;

	// encrypt  
	const cipher = crypto.createCipheriv(alg, key, iv);
	cipher.setAutoPadding(autoPad); // default true  
	let ciph = cipher.update(plaintext, 'utf8', 'hex');
	ciph += cipher.final('hex');
	console.log(alg, ciph);

	// decrypt  
	const decipher = crypto.createDecipheriv(alg, key, iv);
	cipher.setAutoPadding(autoPad);
	let txt = decipher.update(ciph, 'hex', 'utf8');
	txt += decipher.final('utf8');
	if (plaintext == txt) {
		console.log('==');
	} else {
		console.log('!==');
	}
}

test_des({
	alg: 'des-ecb',
	autoPad: true,
	key: '01234567',
	plaintext: '1234567812345678',
	iv: null
});

test_des({
	alg: 'des-cbc',
	autoPad: true,
	key: '01234567',
	plaintext: '1234567812345678',
	iv: '12345678'
});
// 默认的3des就是这个
test_des({
	alg: 'des-ede3', // 3des-ecb  
	autoPad: true,
	key: 'cf410f84904a44cc8a7f48fc', // 密钥必须是24位 // cf410f84904a44cc8a7f48fc4134e8f9 
	plaintext: '15629551180',
	iv: null
});

test_des({
	alg: 'des-ede3-cbc', // 3des-cbc  
	autoPad: true,
	key: '0123456789abcd0123456789', // 密钥必须是24位 
	plaintext: '15629551180',
	iv: '12345678'
});