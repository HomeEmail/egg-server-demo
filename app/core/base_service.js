const Service = require('egg').Service;

class BaseService extends Service {
  async queryByPage(obj){
    //let sql = 'SELECT `file`.*,rela_tables_file.tables_id FROM `rela_tables_file` LEFT JOIN `file` ON `rela_tables_file`.`file_id`=`file`.`file_id` WHERE `rela_tables_file`.`id`<=(SELECT `rela_tables_file`.`id` FROM `rela_tables_file` LEFT JOIN `file` ON `rela_tables_file`.`file_id`=`file`.`file_id` WHERE `rela_tables_file`.`disabled`=0 AND `file`.`disabled`=0 ORDER BY `rela_tables_file`.`id` DESC LIMIT ?,1) AND `rela_tables_file`.`disabled`=0 AND `file`.`disabled`=0 ORDER BY `rela_tables_file`.`id` DESC LIMIT ?';
    //let sql = 'SELECT COUNT(rela_tables_file.id) as totalCount FROM rela_tables_file LEFT JOIN `file` ON `rela_tables_file`.`file_id`=`file`.`file_id` WHERE `rela_tables_file`.`disabled`=0 AND `file`.`disabled`=0';
    // obj = {
    //   primaryKey:'rela_tables_file.id',
    //   select:'`file`.*,rela_tables_file.tables_id',
    //   from:'rela_tables_file LEFT JOIN `file` ON `rela_tables_file`.`file_id`=`file`.`file_id`',
    //   where:[ //AND 关系
    //     '`rela_tables_file`.`disabled`=0',
    //     {
    //       conf:'`file`.`disabled`=?',
    //       value:0,
    //     },
    //   ],
    //   orderBy:'``rela_tables_file`.`id` DESC',
    //   pageSize:20,
    //   offset:0,
    // };
    if(!obj.primaryKey||!obj.select||!obj.from){
      return {};
    }

    const mysqlClient = this.app.mysql.get('db1');

    let sql1=`SELECT COUNT(${obj.primaryKey}) as totalCount FROM ${obj.from}`;
    let paramAry1=[];
    let sql1_ary_where=[];
    if(obj.where&&obj.where.length>0){
      obj.where.forEach(item => {
        if(typeof item === 'string'){
          sql1_ary_where.push(item);
        } else {
          sql1_ary_where.push(item.conf);
          paramAry1.push(item.value);
        }
      });
      sql1= `${sql1} WHERE ${sql1_ary_where.join(' AND ')}`;
    }
    console.log(sql1);
    console.log(paramAry1);
    const totalResult = await mysqlClient.query(sql1,paramAry1);

    let sql2=`SELECT ${obj.select} FROM ${obj.from} WHERE ${obj.primaryKey}<=`;
    let paramAry2=[];
    let sql2_ary_where=[];
    let sqlSub2_ary_where=[];
    let sqlSub2=`SELECT ${obj.primaryKey} FROM ${obj.from}`;
    if(obj.where&&obj.where.length>0){
      obj.where.forEach(item => {
        if(typeof item === 'string'){
          sqlSub2_ary_where.push(item);
        } else {
          sqlSub2_ary_where.push(item.conf);
          paramAry2.push(item.value);
        }
      });
      sqlSub2 = `${sqlSub2} WHERE ${sqlSub2_ary_where.join(' AND ')}`;
    }
    if(obj.orderBy){
      sqlSub2= `${sqlSub2} ORDER BY ${obj.orderBy}`;
    }
    sqlSub2=`${sqlSub2} LIMIT ?,1`;
    paramAry2.push(obj.offset||0);

    sql2=`${sql2} (${sqlSub2})`;
   
    if(obj.where&&obj.where.length>0){
      obj.where.forEach(item => {
        if(typeof item === 'string'){
          sql2_ary_where.push(item);
        } else {
          sql2_ary_where.push(item.conf);
          paramAry2.push(item.value);
        }
      });
      sql2 = `${sql2} AND ${sql2_ary_where.join(' AND ')}`;
    }
    if(obj.orderBy){
      sql2= `${sql2} ORDER BY ${obj.orderBy}`;
    }
    sql2=`${sql2} LIMIT ?`;
    paramAry2.push(obj.pageSize||20);
    console.log(sql2);
    console.log(paramAry2);

    const result = await mysqlClient.query(sql2, paramAry2);
    return {data:result,...totalResult[0]};
  }
}
module.exports = BaseService;