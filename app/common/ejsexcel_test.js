const ejsExcel = require('ejsexcel');
const fs = require('fs');
const path = require('path');

//  const projectRootPath=path.resolve('./');// 当前执行node命令时所处的目录路径
//  console.log('projectRootPath:'+projectRootPath);
//  console.log('__dirname:'+__dirname);
//  console.log('__filename:'+__filename);
//  const parentPath=path.resolve(__dirname, '..');// 当前目录的上级目录
//  console.log('parentPath:'+parentPath);

//  const newPath=path.join(__dirname, 'views','aa','bb','ad.js');// 路径拼接
//  console.log('拼接的新路径 newPath:'+newPath);

// 获得Excel模板的buffer对象
// 只能读取xlsx格式的表格,表格要规矩，不要有合并单元格的情况
// const exlBuf = fs.readFileSync('./test.xlsx');
// const exlBuf = fs.readFileSync(path.join(__dirname,'readXls.xlsx'));
const exlBuf = fs.readFileSync('/Users/ivan/10010project/incentive-support/server-web/upload/20191020/15715587796476349.xlsx');
// getExcelArr 返回Promise对象
ejsExcel.getExcelArr(exlBuf).then(function (exlJson) {
	console.log(exlJson);// json 数组对象
	for (let i = 0, len = exlJson[0].length; i < len; i++) {
		const row = exlJson[0][i];
		//  console.log(row);
		//  debugger;
	}
}).catch(function (err) {
	console.error(err);
});
