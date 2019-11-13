const Service = require('egg').Service;
class UserService extends Service {

    async getOneByName(loginName){
    	const mysqlClient = this.app.mysql.get('db1'); 
		const result = await mysqlClient.get('sys_user',{loginName:loginName,status:'0'});//status:0可用，1删除
		return result||[];
    }

    async getAll(){
    	const mysqlClient = this.app.mysql.get('db1'); 
    	const results = await mysqlClient.select('sys_user');
    	return results||[];
    }

    async getAuthority(userId){
        const mysqlClient = this.app.mysql.get('db1'); 
    	//const postId = 1;
		const results = await mysqlClient.query('SELECT au.pkId,au.authCode,au.`name`,au.url,au.pid,au.authType FROM sys_user_role_rel ur LEFT JOIN sys_role_authority_rel ra ON ur.roleId=ra.roleId LEFT JOIN sys_authority au ON au.pkId=ra.authId WHERE ur.userId=?', [userId]);
		return results || [];
    }


}
module.exports = UserService;