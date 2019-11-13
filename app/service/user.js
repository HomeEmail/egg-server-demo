const Service = require('egg').Service;

class UserService extends Service {
    async create(body){
     	const mysqlClient = this.app.mysql.get('db1'); 
     	const Literal = mysqlClient.literals.Literal;
     	let psw='123456';
     	const result = await mysqlClient.insert('user',{
     		name:'user1',
     		username:'user'+Date.now(),
     		password: new Literal(`SHA("${psw}")`),
     		age:23,
     		update_at:mysqlClient.literals.now,
     		create_at:mysqlClient.literals.now
     	});  
     	console.log(result);
     	const insertSuccess = result.affectedRows === 1;
     	if(insertSuccess){
     		return {
     			code : 1,
     			msg:'插入成功',
     			id:result.insertId
     		};
     	}else{
	     	return {
	     		code:0,
	     		msg:'插入失败'
	     	};

     	}
    }
    async getOne(id = 1){
    	const mysqlClient = this.app.mysql.get('db1'); 
		const result = await mysqlClient.get('user',{id:id});
		console.log('------getOne-----',result);
    	return {
			code:1,
			data:result,
			msg:'获取成功'
		};
    }
    async getAll(){
    	const mysqlClient = this.app.mysql.get('db1'); 
    	const result = await mysqlClient.select('user');
    	return {
			code:1,
			data:result,
			msg:'获取成功'
		};
    }
    async getByWhere(body){
    	const mysqlClient = this.app.mysql.get('db1'); 
    	const result = await mysqlClient.select('user',{
    		where:{id:1,username:['user1']},//where条件
    		columns:['id','name','username'],//要查询的表字段
    		orders:[['create_at','desc'],['id','desc']],//排序方式
    		limit:10,//返回数据量
    		offset:0,//数据偏移量
    	});
    	return {
			code:1,
			data:result,
			msg:'获取成功'
		};
    }
    async query(body){ //直接执行 sql 语句
    	const mysqlClient = this.app.mysql.get('db1'); 
    	//const postId = 1;
		//const results = await mysqlClient.query('update posts set hits = (hits + ?) where id = ?', [1, postId]);
		//=> update posts set hits = (hits + 1) where id = 1;

    }
    async update(body){
    	const mysqlClient = this.app.mysql.get('db1'); 
    	const row = {
    		name:'user1'+Date.now(),
    		update_at:mysqlClient.literals.now,
    	};
    	const options = {
    		where:{
    			id:1
    		}
    	};

    	const result = await mysqlClient.update('user',row,options);
    	console.log(result);
     	const updateSuccess = result.affectedRows >= 1;
     	if(updateSuccess){
     		return {
     			code : 1,
     			msg:'更新成功',
     			rowNum:result.affectedRows
     		};
     	}else{
	     	return {
	     		code:0,
	     		msg:'更新失败',
     			rowNum:result.affectedRows
	     	};

     	}
    }
    async del(id = 3){
    	const mysqlClient = this.app.mysql.get('db1'); 
    	const result = await mysqlClient.delete('user',{id:id});
    	console.log(result);
     	const deleteSuccess = result.affectedRows >= 1;
     	if(deleteSuccess){
     		return {
     			code : 1,
     			msg:'删除成功',
     			rowNum:result.affectedRows
     		};
     	}else{
	     	return {
	     		code:0,
	     		msg:'删除失败',
     			rowNum:result.affectedRows
	     	};

     	}
    }
    async useTransaction(){ //事务使用
    	const mysqlClient = this.app.mysql.get('db1'); 

    	//手动控制
     	// const conn = await mysqlClient.beginTransaction(); // 初始化事务
		// try {
		// 	await conn.insert(table, row1);  // 第一步操作
		// 	await conn.update(table, row2);  // 第二步操作
		// 	await conn.commit(); // 提交事务
		// } catch (err) {
		// 	// error, rollback
		// 	await conn.rollback(); // 一定记得捕获异常后回滚事务！！
		// 	throw err;
		// }

		//自动控制
		// const result = await mysqlClient.beginTransactionScope(async conn => {
		// 	// don't commit or rollback by yourself
		// 	await conn.insert(table, row1);
		// 	await conn.update(table, row2);
		// 	return { success: true };
		// }, this.ctx); // ctx 是当前请求的上下文，如果是在 service 文件中，可以从 `this.ctx` 获取到
		// // if error throw on scope, will auto rollback

    }



}
module.exports = UserService;