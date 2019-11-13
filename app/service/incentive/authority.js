const Service = require('egg').Service;
class AuthorityService extends Service {
  async getUserAuthority(user_id){
    const mysqlClient = this.app.mysql.get('db1');
    //SELECT `authority`.`*` FROM `rela_user_authority` LEFT JOIN `authority` ON `rela_user_authority`.`authority_id`=`authority`.`authority_id` WHERE `rela_user_authority`.`user_id`=1
    let sql = 'SELECT `authority`.`*` FROM `rela_user_authority` LEFT JOIN `authority` ON `rela_user_authority`.`authority_id`=`authority`.`authority_id` WHERE `rela_user_authority`.`user_id`=?';
    let paramAry = [user_id];
    const result = await mysqlClient.query(sql, paramAry);
    return result || 0;
  }
  async getAllAuthorityList(){
    const mysqlClient = this.app.mysql.get('db1');
    let sql = 'SELECT `authority`.`*` FROM `authority`';
    let paramAry = [];
    const result = await mysqlClient.query(sql, paramAry);
    return result || 0;
  }
  async insertUserAuthRecord(obj) { //插入成功返回插入的主键id，否则返回null
    const mysqlClient = this.app.mysql.get('db1');
    //const ctx = this.ctx;
    const result = await mysqlClient.insert('rela_user_authority', {
      ...obj,
    });
    const insertSuccess = result.affectedRows === 1;
    if (insertSuccess) {
      return result.insertId;
    } else {
      return null;
    }
  }
  async deleteUserAuthRecord(obj) { //删除关联权限
    const mysqlClient = this.app.mysql.get('db1');
    //const ctx = this.ctx;
    const result = await mysqlClient.delete('rela_user_authority', {
      ...obj,
    });
    const deleteSuccess = result.affectedRows >= 1;
    if (deleteSuccess) {
      return true;
    } else {
      return null;
    }
  }

}

module.exports = AuthorityService;