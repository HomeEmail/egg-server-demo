const Service = require('egg').Service;
class UserService extends Service {

    async getOneByName(user_account){
    	const mysqlClient = this.app.mysql.get('db1'); 
			const result = await mysqlClient.get('user',{user_account:user_account,disabled:0});//disable:0可用，1删除
			return result||[];
    }
    async insertUserRecord(obj) { //插入成功返回插入的主键id，否则返回null
      const mysqlClient = this.app.mysql.get('db1');
      //const ctx = this.ctx;
      const result = await mysqlClient.insert('user', {
        ...obj,
        disabled: 0,
      });
      const insertSuccess = result.affectedRows === 1;
      if (insertSuccess) {
        return result.insertId;
      } else {
        return null;
      }
    }

    // async getAll(){
    // 	const mysqlClient = this.app.mysql.get('db1'); 
    // 	const results = await mysqlClient.select('sys_user');
    // 	return results||[];
    // }

    // async getAuthority(userId){
    //     const mysqlClient = this.app.mysql.get('db1'); 
    // 	//const postId = 1;
		// const results = await mysqlClient.query('SELECT au.pkId,au.authCode,au.`name`,au.url,au.pid,au.authType FROM sys_user_role_rel ur LEFT JOIN sys_role_authority_rel ra ON ur.roleId=ra.roleId LEFT JOIN sys_authority au ON au.pkId=ra.authId WHERE ur.userId=?', [userId]);
		// return results || [];
    // }
}
module.exports = UserService;