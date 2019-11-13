const Service = require('egg').Service;
class TablesService extends Service {
  async insertTablesRecord(obj) { //插入成功返回插入的主键id，否则返回null
    const mysqlClient = this.app.mysql.get('db1');
    //const ctx = this.ctx;
    try {
      const result = await mysqlClient.insert('tables', {
        ...obj,
        disabled: 0,
        create_at: mysqlClient.literals.now,
        update_at: mysqlClient.literals.now,
      });
      const insertSuccess = result.affectedRows === 1;
      if (insertSuccess) {
        return result.insertId;
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  }
  async deleteTablesRecord(obj) { //删除表格
    const mysqlClient = this.app.mysql.get('db1');
    //const ctx = this.ctx;
    const result = await mysqlClient.delete('tables', {
      ...obj,
    });
    const deleteSuccess = result.affectedRows >= 1;
    if (deleteSuccess) {
      return true;
    } else {
      return null;
    }
  }
  async getOneByTablesId(tables_id) {
    const mysqlClient = this.app.mysql.get('db1');
    const result = await mysqlClient.get('tables', { tables_id: tables_id, disabled: 0 });//disable:0可用，1删除
    return result || {};
  }
  async updateTablesRecord(tables_id,obj){
    const mysqlClient = this.app.mysql.get('db1');
    const row = {
      ...obj,
      update_at: mysqlClient.literals.now,
    };
    const options = {
      where: {
        tables_id: tables_id,
      }
    };
    const result = await mysqlClient.update('tables', row, options);
    //console.log(result);
    const updateSuccess = result.affectedRows >= 1;
    if (updateSuccess) {
      return result.affectedRows;
    } else {
      return null;
    }
  }
  async updateReviewStatusByTablesId(tables_id,review_status_id){
    const mysqlClient = this.app.mysql.get('db1');
    const row = {
      review_status_id: review_status_id,
      update_at: mysqlClient.literals.now,
    };
    const options = {
      where: {
        tables_id: tables_id,
      }
    };
    const result = await mysqlClient.update('tables', row, options);
    //console.log(result);
    const updateSuccess = result.affectedRows >= 1;
    if (updateSuccess) {
      return result.affectedRows;
    } else {
      return null;
    }
  }
  async updateReviewStatusByTablesIdBatch(tables_ids, review_status_id) { //批量更新状态 tables_ids是数组 
    //UPDATE `tables` SET `review_status_id` = 1, `update_at` = '' WHERE `tables_id` in ('108');
    const mysqlClient = this.app.mysql.get('db1');
    const result = await mysqlClient.query('UPDATE `tables` SET `review_status_id` = ?, `update_at` = ? WHERE `tables_id` in (?)', [review_status_id, new Date(), tables_ids]);
    return !!result && !!result.affectedRows ? result.affectedRows : null; //更新成功返回成功记录数，否则返回null
  }
  async getTablesListByDepartmentNameTotalCount(department_name='',user_account=''){
    const mysqlClient = this.app.mysql.get('db1');
    //SELECT COUNT(`tables`.`tables_id`) as totalCount FROM `tables` LEFT JOIN `review_status` ON `tables`.`review_status_id`=`review_status`.`review_status_id` LEFT JOIN `rela_tables_file` ON `tables`.`tables_id`=`rela_tables_file`.`tables_id` LEFT JOIN `file` ON `rela_tables_file`.`file_id`=`file`.`file_id` WHERE `rela_tables_file`.`disabled`=0 AND `tables`.`department_name`='通信开放事业部' AND `tables`.`user_account`='liucb36'
    let sql = 'SELECT COUNT(`tables`.`tables_id`) as totalCount FROM `tables` LEFT JOIN `review_status` ON `tables`.`review_status_id`=`review_status`.`review_status_id` LEFT JOIN `rela_tables_file` ON `tables`.`tables_id`=`rela_tables_file`.`tables_id` LEFT JOIN `file` ON `rela_tables_file`.`file_id`=`file`.`file_id` WHERE `rela_tables_file`.`disabled`=0';
    let paramAry = [];
    if(!!user_account){
      sql+=' AND `tables`.`user_account`=?';
      paramAry.push(user_account);
    }
    if(!!department_name){
      sql+=' AND `tables`.`department_name`=?';
      paramAry.push(department_name);
    }
    const result = await mysqlClient.query(sql, paramAry);
    return result || 0;
  }
  async getTablesListByDepartmentName(department_name='',user_account='',pageNo=1,pageSize=10){
    //SELECT `tables`.*,`review_status`.`review_status_name`,`file`.`file_name`,`file`.`file_id` FROM `tables` LEFT JOIN `review_status` ON `tables`.`review_status_id`=`review_status`.`review_status_id` LEFT JOIN `rela_tables_file` ON `tables`.`tables_id`=`rela_tables_file`.`tables_id` LEFT JOIN `file` ON `rela_tables_file`.`file_id`=`file`.`file_id` WHERE `tables`.`tables_id`<=(SELECT `tables`.`tables_id` FROM `tables` LEFT JOIN `review_status` ON `tables`.`review_status_id`=`review_status`.`review_status_id` LEFT JOIN `rela_tables_file` ON `tables`.`tables_id`=`rela_tables_file`.`tables_id` LEFT JOIN `file` ON `rela_tables_file`.`file_id`=`file`.`file_id` WHERE `rela_tables_file`.`disabled`=0 AND `tables`.`department_name`='通信开放事业部' AND `tables`.`user_account`='?' ORDER BY `tables`.`tables_id` DESC LIMIT 0,1) AND `rela_tables_file`.`disabled`=0 AND `tables`.`department_name`='通信开放事业部' AND `tables`.`user_account`='?' ORDER BY `tables`.`tables_id` DESC LIMIT 10
    const mysqlClient = this.app.mysql.get('db1');
    let offset = (pageNo - 1) * pageSize;//偏移值
    if (offset < 0) offset = 0;
    let sql = 'SELECT `tables`.*,`review_status`.`review_status_name`,`file`.`file_name`,`file`.`file_id` FROM `tables` LEFT JOIN `review_status` ON `tables`.`review_status_id`=`review_status`.`review_status_id` LEFT JOIN `rela_tables_file` ON `tables`.`tables_id`=`rela_tables_file`.`tables_id` LEFT JOIN `file` ON `rela_tables_file`.`file_id`=`file`.`file_id` WHERE `tables`.`tables_id`<=';
    let paramAry = [];

    let sqlSub='SELECT `tables`.`tables_id` FROM `tables` LEFT JOIN `review_status` ON `tables`.`review_status_id`=`review_status`.`review_status_id` LEFT JOIN `rela_tables_file` ON `tables`.`tables_id`=`rela_tables_file`.`tables_id` LEFT JOIN `file` ON `rela_tables_file`.`file_id`=`file`.`file_id` WHERE `rela_tables_file`.`disabled`=0';
    if(!!user_account){
      sqlSub+=' AND `tables`.`user_account`=?';
      paramAry.push(user_account);
    }
    if(!!department_name){
      sqlSub+=' AND `tables`.`department_name`=?';
      paramAry.push(department_name);
    }
    sqlSub+=' ORDER BY `tables`.`tables_id` DESC LIMIT ?,1';
    paramAry.push(offset);
    sql+='('+sqlSub+')';

    sql+=' AND `rela_tables_file`.`disabled`=0';
    if(!!user_account){
      sql+=' AND `tables`.`user_account`=?';
      paramAry.push(user_account);
    }
    if(!!department_name){
      sql+=' AND `tables`.`department_name`=?';
      paramAry.push(department_name);
    }
    sql+=' ORDER BY `tables`.`tables_id` DESC LIMIT ?';
    paramAry.push(pageSize);

    const result = await mysqlClient.query(sql, paramAry);
    return result || 0;

  }

}

module.exports = TablesService;