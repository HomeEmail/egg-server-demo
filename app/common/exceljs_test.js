const path = require('path');
const Excel = require('exceljs');

//  read from a file
const workbook = new Excel.Workbook();
const filename = path.join(__dirname, 'readXls.xlsx');
workbook.xlsx.readFile(filename)
	.then(function (wb) {
		//  use workbook
		// console.log(wb);
		const sheet = wb.getWorksheet(1); //  从1开始
		// console.log(sheet);
		console.log(sheet.actualColumnCount);// 有值的列数
		console.log(sheet.actualRowCount);// 有值的行数
		console.log(sheet.columnCount);// 列数
		console.log(sheet.rowCount);// 行数
		const rows = sheet.getSheetValues();
		// console.log(rows);// 返回行数据 带 abcd 12345 表的头 默认undefined
		const col = sheet.getColumn(1);// 从1开始
		// console.log(col.values); // 这列数据 带 abcd 表的头
		//  col.eachCell({ includeEmpty: true }, function(cell, rowNumber) { // 这循环 默认去除了 abcd 12345 表的头
		//    console.log(cell.value,rowNumber);
		//  });
		sheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
			// console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));// 带 abcd 12345 表的头 默认undefined
			row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
				console.log('Cell ' + colNumber + ' = ' + cell.value, cell.isMerged, cell.$col$row);// 不带 abcd 12345 表的头
			});
		});
		console.log(sheet.getCell('A1').value);// 直接获取表格单元值
		// sheet.mergeCells(1, 2, 1, 5);// 第1行  第2列  合并到第1行的第5列// 合并单元格
		console.log(sheet.model);
		console.log(sheet.model.rows[1].cells);
		console.log(sheet.model.merges); // 读取单元合并 ['C1:D1']
		// console.log(sheet);
		// console.log(rows[0]);
		//  wb._worksheets.forEach(v => {
		//    v._rows.forEach(vr=>{
		//      vr._cells.forEach(vc => {
		//        console.log(vc._address,vc._value.model.value);
		//      })
		//    });
		//  });
	});