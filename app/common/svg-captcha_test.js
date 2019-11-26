
const svgCaptcha = require('svg-captcha');

const c = svgCaptcha.create({ // 普通验证码
	size: 4,
	noise: 2,
	color: true,
	background: '#dddddd',
	width: 80,
	height: 40,
	fontSize: 20
});
// //  {data: '<svg.../svg>', text: 'abcd'}
console.log(c);

const cc = svgCaptcha.createMathExpr({ // 算术验证码
	size: 4,
	noise: 2,
	color: true,
	background: '#dddddd',
	width: 80,
	height: 40,
	fontSize: 20
});
console.log(cc);

// 在 express中使用
/*
let svgCaptcha = require('svg-captcha');

app.get('/captcha', function (req, res) {
	let captcha = svgCaptcha.create();
	req.session.captcha = captcha.text;

	res.type('svg'); //  使用ejs等模板时如果报错 res.type('html')
	res.status(200).send(captcha.data);
});
*/