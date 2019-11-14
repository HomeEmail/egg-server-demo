const Service = require('../core/base_service');

class AdminService extends Service {
    async create(body){
     	const mysqlClient = this.app.mysql.get('db1'); 
     	const Literal = mysqlClient.literals.Literal;
     	let psw='123456';
     	const result = await mysqlClient.insert('admin',{
				admin_account:'user'+Date.now(),
				admin_email:'22'+Date.now()+'@qq.com',
     		admin_password: new Literal(`SHA("${psw}")`),
				admin_name:'user',
     		admin_age:23,
     		updated_at:mysqlClient.literals.now,
     		created_at:mysqlClient.literals.now
     	});  
     	console.log(result);
     	const insertSuccess = result.affectedRows === 1;
     	if(insertSuccess){
     		return result.insertId;
     	}else{
	     	return null;
     	}
    }
    async getOne(id = 4){
    	const mysqlClient = this.app.mysql.get('db1'); 
			const result = await mysqlClient.get('admin',{admin_id:id});
			console.log('------getOne-----',result);
			
    	return result;
		}
		async getByPage(pageNo=1,pageSize=1){
			let offset = (pageNo - 1) * pageSize;//偏移值
			if (offset < 0) offset = 0;
			const result = await this.queryByPage({
				primaryKey:'admin_id',
				select:'admin_id,admin_account,admin_name,admin_age,admin_email',
				from:'admin',
				where:[
					{
						conf:'disabled=?',
						value:0,
					}
				],
				orderBy:'admin_id DESC',
				offset:offset,
				pageSize:pageSize,
			});
			return result;
		}
    async getAll(){
    	const mysqlClient = this.app.mysql.get('db1'); 
    	const result = await mysqlClient.select('admin');
    	return result;
    }
    async getByWhere(body){
    	const mysqlClient = this.app.mysql.get('db1'); 
    	const result = await mysqlClient.select('admin',{
    		where:{disabled:0,admin_name:['user']},//where条件
    		columns:['admin_id','admin_name','admin_account'],//要查询的表字段
    		orders:[['created_at','desc'],['admin_id','desc']],//排序方式
    		limit:10,//返回数据量
    		offset:0,//数据偏移量
    	});
    	return result;
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
    		admin_name:'user1'+Date.now(),
				updated_at:mysqlClient.literals.now,
				last_sign_in_at:mysqlClient.literals.now,
				disabled:1,
    	};
    	const options = {
    		where:{
    			admin_id:1
    		}
    	};

    	const result = await mysqlClient.update('admin',row,options);
    	console.log(result);
     	const updateSuccess = result.affectedRows >= 1;
     	if(updateSuccess){
     		return result.affectedRows;
     	}else{
	     	return null;

     	}
    }
    async del(id = 3){
    	const mysqlClient = this.app.mysql.get('db1'); 
    	const result = await mysqlClient.delete('admin',{admin_id:id});
    	console.log(result);
     	const deleteSuccess = result.affectedRows >= 1;
     	if(deleteSuccess){
     		return result.affectedRows;
     	}else{
	     	return null;

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
module.exports = AdminService;