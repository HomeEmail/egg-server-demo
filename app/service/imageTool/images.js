const Service = require('egg').Service;
class ImagesService extends Service {

  async getImageInfoById(id) {
    const mysqlClient = this.app.mysql.get('db1');
    const result = await mysqlClient.get('images', { id: id, disable: '0' });//disable:0可用，1删除
    return result || [];
  }
  async getUserImageTotalCount(user_id, label_id, album_id) {
    const mysqlClient = this.app.mysql.get('db1');
    let sql = 'SELECT COUNT(id) as totalCount FROM images WHERE disable=? AND user_id=?';
    let paramAry = [0, user_id];
    if (!!label_id) {
      sql += ' AND label_id=?';
      paramAry.push(label_id);
    }
    if (!!album_id) {
      sql += ' AND album_id=?';
      paramAry.push(album_id);
    }
    const result = await mysqlClient.query(sql, paramAry);
    return result || 0;
  }
  async getUserImages(user_id, label_id, album_id, pageNo = 0, pageSize = 50) {
    const mysqlClient = this.app.mysql.get('db1');
    let offset = (pageNo - 1) * pageSize;//偏移值
    if (offset < 0) offset = 0;
    //SELECT * FROM images WHERE id<=(SELECT id FROM images WHERE user_id=1 AND disable=0 AND label_id=0 AND album_id=0 ORDER BY id DESC LIMIT 0,1) and user_id=1 AND disable=0 AND label_id=0 AND album_id=0 ORDER BY id DESC LIMIT 100
    let sql = 'SELECT * FROM images WHERE id<=';
    let sqlsub = 'SELECT id FROM images WHERE user_id=? AND disable=?';
    let paramAry = [user_id, 0];
    if (!!label_id) {
      sqlsub += ' AND label_id=?';
      paramAry.push(label_id);
    }
    if (!!album_id) {
      sqlsub += ' AND album_id=?';
      paramAry.push(album_id);
    }
    sqlsub += ' ORDER BY id DESC LIMIT ?,1';
    paramAry.push(offset);
    sql += '(' + sqlsub + ') and user_id=? AND disable=?';
    paramAry.push(user_id);
    paramAry.push(0);

    if (!!label_id) {
      sql += ' AND label_id=?';
      paramAry.push(label_id);
    }
    if (!!album_id) {
      sql += ' AND album_id=?';
      paramAry.push(album_id);
    }

    sql += ' ORDER BY id DESC LIMIT ?';
    paramAry.push(pageSize);
    console.log('getUserImages sql:', sql);
    const result = await mysqlClient.query(sql, paramAry);
    return result || 0;
  }
  async getImageColors(images_id) {
    const mysqlClient = this.app.mysql.get('db1');
    let sql = 'SELECT * FROM image_colors WHERE images_id=?';
    let paramAry = [images_id];
    const result = await mysqlClient.query(sql, paramAry);
    return result || 0;
  }
  async getImagesByColor(obj) { //obj:{h,s,v,weights,hOffset,sOffset,vOffset} weights:1-5
    const mysqlClient = this.app.mysql.get('db1');
    let hb = obj.h - (obj.hOffset || 20);
    if (hb < 0) hb = 0;
    let ht = obj.h + (obj.hOffset || 20);
    if (ht > 360) ht = 360;

    let sb = obj.s - (obj.sOffset || 0.05);
    if (sb < 0) sb = 0;
    let st = obj.s + (obj.sOffset || 0.05);
    if (st > 1) st = 1;

    let vb = obj.v - (obj.vOffset || 0.05);
    if (vb < 0) vb = 0;
    let vt = obj.v + (obj.vOffset || 0.05);
    if (vt > 1) vt = 1;

    if (!!!obj.weights) obj.weights = 2;
    if (obj.weights > 5) obj.weights = 5;

    let user_id = obj.user_id || 0;

    // if(!!!obj.pageNo||obj.pageNo<1) obj.pageNo=1;
    // if(!!!obj.pageSize) obj.pageSize=50;
    // let offset = (obj.pageNo-1)*obj.pageSize;//偏移值
    // if(offset<0) offset=0;

    //SELECT images.* FROM image_colors LEFT JOIN images ON images.id = image_colors.images_id WHERE image_colors.h<50 AND image_colors.h>10 AND image_colors.s<0.711 AND image_colors.s>0.502 AND image_colors.v<0.855 AND image_colors.v>0.711 AND image_colors.weights<=5;

    let sql = 'SELECT images.* FROM image_colors LEFT JOIN images ON images.id = image_colors.images_id WHERE image_colors.h<? AND image_colors.h>? AND image_colors.s<? AND image_colors.s>? AND image_colors.v<? AND image_colors.v>? AND image_colors.weights<=? AND images.user_id=? GROUP BY images.id;';
    let paramAry = [ht, hb, st, sb, vt, vb, obj.weights, user_id];
    console.log('getImagesByColor sql:', sql);
    const result = await mysqlClient.query(sql, paramAry);
    return result || 0;
  }


  async insertImagesRecord(obj) { //插入成功返回插入的主键id，否则返回null
    const mysqlClient = this.app.mysql.get('db1');
    const ctx = this.ctx;
    const userId = ctx.session.userinfo.userId;
    const result = await mysqlClient.insert('images', {
      ...obj,
      disable: 0,
      user_id: userId,
      // createTime:mysqlClient.literals.now,
      // updateTime:mysqlClient.literals.now,
    });
    const insertSuccess = result.affectedRows === 1;
    if (insertSuccess) {
      return result.insertId;
    } else {
      return null;
    }
  }

  async insertImageColorsRecord(obj) { //插入成功返回插入的主键id，否则返回null
    const mysqlClient = this.app.mysql.get('db1');
    // const ctx=this.ctx;
    // const userId=ctx.session.userinfo.userId;
    const result = await mysqlClient.insert('image_colors', {
      ...obj,
      // createTime:mysqlClient.literals.now,
      // updateTime:mysqlClient.literals.now,
    });
    const insertSuccess = result.affectedRows === 1;
    if (insertSuccess) {
      return result.insertId;
    } else {
      return null;
    }
  }

  async updateImageAlbum(id, album_id) { //更新成功返回成功记录数，否则返回null
    const mysqlClient = this.app.mysql.get('db1');
    const ctx = this.ctx;
    const userId = ctx.session.userinfo.userId;
    const row = {
      album_id: album_id,
    };
    const options = {
      where: {
        id: id,
        user_id: userId
      }
    };

    const result = await mysqlClient.update('images', row, options);
    //console.log(result);
    const updateSuccess = result.affectedRows >= 1;
    if (updateSuccess) {
      return result.affectedRows;
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
module.exports = ImagesService;