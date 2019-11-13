const Service = require('egg').Service;
class incentiveDataService extends Service {
  async insertIncentiveDataRecord(obj) { //插入成功返回插入的主键id，否则返回null
    const mysqlClient = this.app.mysql.get('db1');
    //const ctx = this.ctx;
    const result = await mysqlClient.insert('incentive_data', {
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
  }

  async deleteIncentiveDataRecord(obj) { //删除表格数据
    const mysqlClient = this.app.mysql.get('db1');
    //const ctx = this.ctx;
    const result = await mysqlClient.delete('incentive_data', {
      ...obj,
    });
    const deleteSuccess = result.affectedRows >= 1;
    if (deleteSuccess) {
      return true;
    } else {
      return null;
    }
  }
  async getOneByIncentiveDataId(incentive_data_id) {
    const mysqlClient = this.app.mysql.get('db1');
    const result = await mysqlClient.get('incentive_data', { incentive_data_id: incentive_data_id, disabled: 0 });//disable:0可用，1删除
    return result || {};
  }
  async getDataListByIncentiveDataIds(ids = []) {
    const mysqlClient = this.app.mysql.get('db1');
    //SELECT `incentive_data`.`*` FROM `incentive_data` WHERE `incentive_data`.`incentive_data_id` IN (3,4);
    let sql = 'SELECT `incentive_data`.`*` FROM `incentive_data` WHERE `incentive_data`.`incentive_data_id` IN (?)';

    let paramAry = [ids];
    const result = await mysqlClient.query(sql, paramAry);
    return result || 0;
  }
  async disableIncentiveDataByTablesIdAndUserId(tables_id,user_id) { //更新成功返回成功记录数，否则返回null
    const mysqlClient = this.app.mysql.get('db1');
    const row = {
      disabled: 1,
      update_at: mysqlClient.literals.now,
    };
    const options = {
      where: {
        tables_id: tables_id,
        user_id: user_id,
      }
    };
    const result = await mysqlClient.update('incentive_data', row, options);
    //console.log(result);
    const updateSuccess = result.affectedRows >= 1;
    if (updateSuccess) {
      return result.affectedRows;
    } else {
      return null;
    }
  }
  async updateReviewStatusByIncentiveDataId(incentive_data_id, review_status_id) {
    const mysqlClient = this.app.mysql.get('db1');
    const row = {
      review_status_id: review_status_id,
      update_at: mysqlClient.literals.now,
    };
    const options = {
      where: {
        incentive_data_id: incentive_data_id,
      }
    };
    const result = await mysqlClient.update('incentive_data', row, options);
    //console.log(result);
    const updateSuccess = result.affectedRows >= 1;
    if (updateSuccess) {
      return result.affectedRows;
    } else {
      return null;
    }
  }
  async updateReviewStatusByIncentiveDataIdBatch(incentive_data_ids, review_status_id) { //批量更新状态 incentive_data_ids是数组 
    //UPDATE `incentive_data` SET `review_status_id` = 1, `update_at` = '' WHERE `incentive_data_id` in ('108');
    const mysqlClient = this.app.mysql.get('db1');
    const result = await mysqlClient.query('UPDATE `incentive_data` SET `review_status_id` = ?, `update_at` = ? WHERE `incentive_data_id` in (?)', [review_status_id, new Date(), incentive_data_ids]);
    return !!result && !!result.affectedRows ? result.affectedRows : null; //更新成功返回成功记录数，否则返回null
  }
  async updateReviewStatusByTablesId(tables_id, review_status_id) {
    const mysqlClient = this.app.mysql.get('db1');
    const row = {
      review_status_id: review_status_id,
      update_at: mysqlClient.literals.now,
    };
    const options = {
      where: {
        tables_id: tables_id,
        disabled: 0,
      }
    };
    const result = await mysqlClient.update('incentive_data', row, options);
    //console.log(result);
    const updateSuccess = result.affectedRows >= 1;
    if (updateSuccess) {
      return result.affectedRows;
    } else {
      return null;
    }
  }
  async getIncentiveDataListByTablesId(tables_id) {
    const mysqlClient = this.app.mysql.get('db1');
    //let sql = 'SELECT * FROM incentive_data WHERE tables_id=? AND disabled=0 ORDER BY incentive_data_id ASC';
    let sql = 'SELECT `incentive_data`.`*`,`t`.`review_comment` FROM `incentive_data` LEFT JOIN (SELECT review_record.* FROM review_record WHERE review_record.review_record_id in (SELECT max(`review_record`.`review_record_id`) `review_record_id` FROM `incentive_data` LEFT JOIN `review_record` ON `incentive_data`.`incentive_data_id`=`review_record`.`incentive_data_id` WHERE `incentive_data`.`tables_id`=? AND `incentive_data`.`disabled`=0 GROUP BY `review_record`.`incentive_data_id`)) `t` ON `incentive_data`.`incentive_data_id`=`t`.`incentive_data_id` WHERE `incentive_data`.`tables_id`=? AND `incentive_data`.`disabled`=0 ORDER BY `incentive_data`.`incentive_data_id` ASC,`t`.`review_record_id` DESC';

    let paramAry = [tables_id, tables_id];
    const result = await mysqlClient.query(sql, paramAry);
    return result || 0;
  }

  async getIncentiveDataListTotalCountByQuery(query = {}) {
    const mysqlClient = this.app.mysql.get('db1');
    //SELECT COUNT(`incentive_data`.`incentive_data_id`) as totalCount FROM `incentive_data` LEFT JOIN `review_status` ON `incentive_data`.`review_status_id`=`review_status`.`review_status_id` LEFT JOIN `tables` ON `incentive_data`.`tables_id`=`tables`.`tables_id` WHERE `incentive_data`.`disabled`=0 AND `incentive_data`.`review_status_id`=1 AND `tables`.`review_status_id`=1 AND `incentive_data`.`accrual_time`='' AND `incentive_data`.`department_name`='' AND `incentive_data`.`profession_name`='' AND `incentive_data`.`contracting_entity_name`='' AND `incentive_data`.`commission_type_name`='' AND `incentive_data`.`project_number` LIKE '%d233%' AND `incentive_data`.`project_name` LIKE '%懂%' ORDER BY `incentive_data`.`incentive_data_id` DESC
    let sql = "SELECT COUNT(`incentive_data`.`incentive_data_id`) as totalCount FROM `incentive_data` LEFT JOIN `review_status` ON `incentive_data`.`review_status_id`=`review_status`.`review_status_id` LEFT JOIN `tables` ON `incentive_data`.`tables_id`=`tables`.`tables_id` WHERE `incentive_data`.`disabled`=0";
    // AND `incentive_data`.`review_status_id`=1 AND `tables`.`review_status_id`=1 AND `incentive_data`.`accrual_time`='' AND `incentive_data`.`department_name`='' AND `incentive_data`.`profession_name`='' AND `incentive_data`.`contracting_entity_name`='' AND `incentive_data`.`commission_type_name`='' AND `incentive_data`.`project_number` LIKE '%d233%' AND `incentive_data`.`project_name` LIKE '%懂%'
    let paramAry = [];
    if (query.review_status_id) {
      sql += ' AND `incentive_data`.`review_status_id`=?';
      paramAry.push(query.review_status_id);
      sql += ' AND `tables`.`review_status_id`=?';
      paramAry.push(query.review_status_id);
    }
    if (query.accrual_time) {
      sql += ' AND `incentive_data`.`accrual_time`=?';
      paramAry.push(query.accrual_time);
    }
    if (query.department_name) {
      sql += ' AND `incentive_data`.`department_name`=?';
      paramAry.push(query.department_name);
    }
    if (query.profession_name) {
      sql += ' AND `incentive_data`.`profession_name`=?';
      paramAry.push(query.profession_name);
    }
    if (query.contracting_entity_name) {
      sql += ' AND `incentive_data`.`contracting_entity_name`=?';
      paramAry.push(query.contracting_entity_name);
    }
    if (query.commission_type_name) {
      sql += ' AND `incentive_data`.`commission_type_name`=?';
      paramAry.push(query.commission_type_name);
    }
    if (query.project_number) {
      sql += ' AND `incentive_data`.`project_number` LIKE ?';
      paramAry.push('%' + query.project_number + '%');
    }
    if (query.project_name) {
      sql += ' AND `incentive_data`.`project_name` LIKE ?';
      paramAry.push('%' + query.project_name + '%');
    }
    sql += " ORDER BY `incentive_data`.`incentive_data_id` DESC";
    const result = await mysqlClient.query(sql, paramAry);
    return result || 0;
  }

  async getIncentiveDataListByQuery(query = {}) {
    const mysqlClient = this.app.mysql.get('db1');
    let pageSize = query.pageSize || 10;
    let pageNo = query.pageNo || 1;
    let offset = (pageNo - 1) * pageSize;//偏移值
    if (offset < 0) offset = 0;
    //SELECT `incentive_data`.`*`,`review_status`.`review_status_name` FROM `incentive_data` LEFT JOIN `review_status` ON `incentive_data`.`review_status_id`=`review_status`.`review_status_id` LEFT JOIN `tables` ON `incentive_data`.`tables_id`=`tables`.`tables_id` WHERE `incentive_data`.`incentive_data_id`<=(SELECT `incentive_data`.`incentive_data_id` FROM `incentive_data` LEFT JOIN `review_status` ON `incentive_data`.`review_status_id`=`review_status`.`review_status_id` LEFT JOIN `tables` ON `incentive_data`.`tables_id`=`tables`.`tables_id` WHERE `incentive_data`.`disabled`=0 AND `incentive_data`.`review_status_id`=1 AND `tables`.`review_status_id`=1 AND `incentive_data`.`accrual_time`='' AND `incentive_data`.`department_name`='' AND `incentive_data`.`profession_name`='' AND `incentive_data`.`contracting_entity_name`='' AND `incentive_data`.`commission_type_name`='' AND `incentive_data`.`project_number` LIKE '%d233%' AND `incentive_data`.`project_name` LIKE '%懂%' ORDER BY `incentive_data`.`incentive_data_id` DESC LIMIT 0,1) AND `incentive_data`.`disabled`=0 AND `incentive_data`.`review_status_id`=1 AND `tables`.`review_status_id`=1 AND `incentive_data`.`accrual_time`='' AND `incentive_data`.`department_name`='' AND `incentive_data`.`profession_name`='' AND `incentive_data`.`contracting_entity_name`='' AND `incentive_data`.`commission_type_name`='' AND `incentive_data`.`project_number` LIKE '%d233%' AND `incentive_data`.`project_name` LIKE '%懂%' ORDER BY `incentive_data`.`incentive_data_id` DESC LIMIT 10
    let sql = 'SELECT `incentive_data`.`*`,`review_status`.`review_status_name` FROM `incentive_data` LEFT JOIN `review_status` ON `incentive_data`.`review_status_id`=`review_status`.`review_status_id` LEFT JOIN `tables` ON `incentive_data`.`tables_id`=`tables`.`tables_id` WHERE `incentive_data`.`incentive_data_id`<=(';
    let paramAry = [];

    let sqlSub = 'SELECT `incentive_data`.`incentive_data_id` FROM `incentive_data` LEFT JOIN `review_status` ON `incentive_data`.`review_status_id`=`review_status`.`review_status_id` LEFT JOIN `tables` ON `incentive_data`.`tables_id`=`tables`.`tables_id` WHERE `incentive_data`.`disabled`=0';
    if (query.review_status_id) {
      sqlSub += ' AND `incentive_data`.`review_status_id`=?';
      paramAry.push(query.review_status_id);
      sqlSub += ' AND `tables`.`review_status_id`=?';
      paramAry.push(query.review_status_id);
    }
    if (query.accrual_time) {
      sqlSub += ' AND `incentive_data`.`accrual_time`=?';
      paramAry.push(query.accrual_time);
    }
    if (query.department_name) {
      sqlSub += ' AND `incentive_data`.`department_name`=?';
      paramAry.push(query.department_name);
    }
    if (query.profession_name) {
      sqlSub += ' AND `incentive_data`.`profession_name`=?';
      paramAry.push(query.profession_name);
    }
    if (query.contracting_entity_name) {
      sqlSub += ' AND `incentive_data`.`contracting_entity_name`=?';
      paramAry.push(query.contracting_entity_name);
    }
    if (query.commission_type_name) {
      sqlSub += ' AND `incentive_data`.`commission_type_name`=?';
      paramAry.push(query.commission_type_name);
    }
    if (query.project_number) {
      sqlSub += ' AND `incentive_data`.`project_number` LIKE ?';
      paramAry.push('%' + query.project_number + '%');
    }
    if (query.project_name) {
      sqlSub += ' AND `incentive_data`.`project_name` LIKE ?';
      paramAry.push('%' + query.project_name + '%');
    }
    sqlSub += ' ORDER BY `incentive_data`.`incentive_data_id` DESC LIMIT ?,1';
    paramAry.push(offset);

    sql += sqlSub + ')'
    sql += ' AND `incentive_data`.`disabled`=0';
    if (query.review_status_id) {
      sql += ' AND `incentive_data`.`review_status_id`=?';
      paramAry.push(query.review_status_id);
      sql += ' AND `tables`.`review_status_id`=?';
      paramAry.push(query.review_status_id);
    }
    if (query.accrual_time) {
      sql += ' AND `incentive_data`.`accrual_time`=?';
      paramAry.push(query.accrual_time);
    }
    if (query.department_name) {
      sql += ' AND `incentive_data`.`department_name`=?';
      paramAry.push(query.department_name);
    }
    if (query.profession_name) {
      sql += ' AND `incentive_data`.`profession_name`=?';
      paramAry.push(query.profession_name);
    }
    if (query.contracting_entity_name) {
      sql += ' AND `incentive_data`.`contracting_entity_name`=?';
      paramAry.push(query.contracting_entity_name);
    }
    if (query.commission_type_name) {
      sql += ' AND `incentive_data`.`commission_type_name`=?';
      paramAry.push(query.commission_type_name);
    }
    if (query.project_number) {
      sql += ' AND `incentive_data`.`project_number` LIKE ?';
      paramAry.push('%' + query.project_number + '%');
    }
    if (query.project_name) {
      sql += ' AND `incentive_data`.`project_name` LIKE ?';
      paramAry.push('%' + query.project_name + '%');
    }
    sql += ' ORDER BY `incentive_data`.`incentive_data_id` DESC LIMIT ?';
    paramAry.push(pageSize);
    const result = await mysqlClient.query(sql, paramAry);
    return result || 0;

  }

}

module.exports = incentiveDataService;