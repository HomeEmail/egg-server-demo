const Service = require('egg').Service;
class ReviewRecordService extends Service {
  async insertReviewRecord(obj) { //插入成功返回插入的主键id，否则返回null
    const mysqlClient = this.app.mysql.get('db1');
    //const ctx = this.ctx;
    const result = await mysqlClient.insert('review_record', {
      ...obj,
      create_at: mysqlClient.literals.now,
    });
    const insertSuccess = result.affectedRows === 1;
    if (insertSuccess) {
      return result.insertId;
    } else {
      return null;
    }
  }
  async getReviewRecordsByIncentiveDataId(incentive_data_id){
    const mysqlClient = this.app.mysql.get('db1');
    let sql = 'SELECT * FROM review_record WHERE incentive_data_id=? ORDER BY review_record_id ASC';
    let paramAry = [incentive_data_id];
    const result = await mysqlClient.query(sql,paramAry);
    return result||0;
  }
  async getReviewRecordsByTablesIdAndSerialNumber(tables_id,serial_number){
    const mysqlClient = this.app.mysql.get('db1');
    let sql = 'SELECT review_record.* FROM review_record LEFT JOIN incentive_data ON incentive_data.`incentive_data_id`=`review_record`.`incentive_data_id` WHERE incentive_data.`tables_id`=? AND `incentive_data`.`serial_number`=? ORDER BY review_record.review_record_id ASC';
    let paramAry = [tables_id,serial_number];
    const result = await mysqlClient.query(sql,paramAry);
    return result||0;
  }
}

module.exports = ReviewRecordService;