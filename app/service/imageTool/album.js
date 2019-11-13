const Service = require('egg').Service;
class AlbumService extends Service {
  async getUserAlbum(){
    const mysqlClient = this.app.mysql.get('db1'); 
    const ctx=this.ctx;
    const userId=ctx.session.userinfo.userId;
    let sql = 'SELECT * FROM album WHERE user_id=?';
    let paramAry = [userId];
    const result = await mysqlClient.query(sql,paramAry);
    return result||0;
  }
  async insertAlbumRecord(obj){ //插入成功返回插入的主键id，否则返回null
    const mysqlClient = this.app.mysql.get('db1');
    const ctx=this.ctx;
    const userId=ctx.session.userinfo.userId;
    const result = await mysqlClient.insert('album',{
        ...obj,
        user_id:userId,
        // createTime:mysqlClient.literals.now,
        // updateTime:mysqlClient.literals.now,
    });  
    const insertSuccess = result.affectedRows === 1;
    if(insertSuccess){
      return result.insertId;
    }else{
      return null;
    }
  }
}
module.exports = AlbumService;