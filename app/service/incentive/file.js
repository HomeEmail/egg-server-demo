const Service = require('egg').Service;
class FileService extends Service {
  async insertFileRecord(obj) { //插入成功返回插入的主键id，否则返回null
    const mysqlClient = this.app.mysql.get('db1');
    //const ctx = this.ctx;
    const result = await mysqlClient.insert('file', {
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
  async getOneByFileId(file_id){
    const mysqlClient = this.app.mysql.get('db1');
    const result = await mysqlClient.get('file',{file_id:file_id,disabled:0});//disable:0可用，1删除
    return result||{};
  }
  async insertRelaTablesFileRecord(obj) { //插入成功返回插入的主键id，否则返回null
    const mysqlClient = this.app.mysql.get('db1');
    const result = await mysqlClient.insert('rela_tables_file', {
      ...obj,
      disabled:0,
    });
    const insertSuccess = result.affectedRows === 1;
    if (insertSuccess) {
      return result.insertId;
    } else {
      return null;
    }
  }
  async disabledRelaTablesFileRecordByTablesId(tables_id){
    const mysqlClient = this.app.mysql.get('db1');
    const row = {
      disabled: 1,
    };
    const options = {
      where: {
        tables_id: tables_id,
      }
    };
    const result = await mysqlClient.update('rela_tables_file', row, options);
    //console.log(result);
    const updateSuccess = result.affectedRows >= 1;
    if (updateSuccess) {
      return result.affectedRows;
    } else {
      return null;
    }
  }
  async getFileListTotalCount(){
    const mysqlClient = this.app.mysql.get('db1');
    //SELECT COUNT(rela_tables_file.id) as totalCount FROM rela_tables_file LEFT JOIN `file` ON `rela_tables_file`.`file_id`=`file`.`file_id` WHERE `rela_tables_file`.`disabled`=0 AND `file`.`disabled`=0
    let sql = 'SELECT COUNT(rela_tables_file.id) as totalCount FROM rela_tables_file LEFT JOIN `file` ON `rela_tables_file`.`file_id`=`file`.`file_id` WHERE `rela_tables_file`.`disabled`=0 AND `file`.`disabled`=0';
    const result = await mysqlClient.query(sql, []);
    return result || 0;
  }
  async getFileList(pageNo = 1, pageSize = 10){
    const mysqlClient = this.app.mysql.get('db1');
    let offset = (pageNo - 1) * pageSize;//偏移值
    if (offset < 0) offset = 0;
    //SELECT `file`.* FROM `rela_tables_file` LEFT JOIN `file` ON `rela_tables_file`.`file_id`=`file`.`file_id` WHERE `rela_tables_file`.`id`<=(SELECT `rela_tables_file`.`id` FROM `rela_tables_file` LEFT JOIN `file` ON `rela_tables_file`.`file_id`=`file`.`file_id` WHERE `rela_tables_file`.`disabled`=0 AND `file`.`disabled`=0 ORDER BY `rela_tables_file`.`id` DESC LIMIT 0,1) AND `rela_tables_file`.`disabled`=0 AND `file`.`disabled`=0 ORDER BY `rela_tables_file`.`id` DESC LIMIT 20;
    let sql = 'SELECT `file`.* FROM `rela_tables_file` LEFT JOIN `file` ON `rela_tables_file`.`file_id`=`file`.`file_id` WHERE `rela_tables_file`.`id`<=(SELECT `rela_tables_file`.`id` FROM `rela_tables_file` LEFT JOIN `file` ON `rela_tables_file`.`file_id`=`file`.`file_id` WHERE `rela_tables_file`.`disabled`=0 AND `file`.`disabled`=0 ORDER BY `rela_tables_file`.`id` DESC LIMIT ?,1) AND `rela_tables_file`.`disabled`=0 AND `file`.`disabled`=0 ORDER BY `rela_tables_file`.`id` DESC LIMIT ?';
    let paramAry = [offset, pageSize];
    const result = await mysqlClient.query(sql, paramAry);
    return result || 0;
  }

}

module.exports = FileService;