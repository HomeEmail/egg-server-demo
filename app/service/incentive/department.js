const Service = require('egg').Service;
class DepartmentService extends Service {
  async getUserDepartment(user_id){
    const mysqlClient = this.app.mysql.get('db1');
    //SELECT `department`.`department_name` FROM `rela_user_department` LEFT JOIN `department` ON `rela_user_department`.`department_id`=`department`.`department_id` WHERE `rela_user_department`.`user_id`=1
    let sql = 'SELECT `department`.`department_name` FROM `rela_user_department` LEFT JOIN `department` ON `rela_user_department`.`department_id`=`department`.`department_id` WHERE `rela_user_department`.`user_id`=?';
    let paramAry = [user_id];
    const result = await mysqlClient.query(sql, paramAry);
    return result || 0;
  }

}

module.exports = DepartmentService;