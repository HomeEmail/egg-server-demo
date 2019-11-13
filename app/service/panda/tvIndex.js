const Service = require('egg').Service;
class tvIndexService extends Service {

    async getMenuTypes(platformId){
        const mysqlClient = this.app.mysql.get('db1'); 
		const results = await mysqlClient.query('SELECT pkId as typeId,typeName,templateId FROM utvgo_tv_index_type WHERE platformId=? and `status`=1 ORDER BY priority DESC', [platformId]);//状态（0待审核，1审核通过，2审核不通过）
		return results || [];
    }

    async getPageDatas(typeId){
        const mysqlClient = this.app.mysql.get('db1');
        const results = await mysqlClient.query('SELECT t.* from (SELECT temp.href,temp.imgUrl,temp.`name`,temp.number,temp.typeId,temp.vodId FROM (SELECT href,imgUrl,`name`,number,typeId,vodId FROM utvgo_tv_index_record WHERE typeId=? AND `status`=1 AND NOW()>ableTime AND NOW()<disableTime ORDER BY priority DESC,pkId DESC) as temp GROUP BY temp.number) as t ORDER BY t.number ASC;',[typeId]);//状态（0待审核，1审核通过，2审核不通过，3已下架）
        return results || [];
    }

    async getPageRecordTotalCount(typeId,number){
        const mysqlClient = this.app.mysql.get('db1');
        const result = await mysqlClient.query('SELECT COUNT(pkId) as totalCount FROM utvgo_tv_index_record WHERE typeId=? AND number=? AND `status`!=3',[typeId,number]);
        return result||0;
    }
    async getPageRecordList(typeId,number,pageNo=1,pageSize=10){
        const mysqlClient = this.app.mysql.get('db1');
        let offset=(pageNo-1)*10;//偏移值
        const results = await mysqlClient.query('SELECT *,pkId as id FROM utvgo_tv_index_record WHERE pkId<=(SELECT pkId FROM utvgo_tv_index_record WHERE typeId=? AND number=? AND `status`!=3 ORDER BY pkId DESC LIMIT ?,1) and typeId=? AND number=? AND `status`!=3 ORDER BY priority DESC,pkId DESC LIMIT ?',[typeId,number,offset,typeId,number,pageSize]);
        return results||[];
    }
    async insertPageRecord(obj){ //插入成功返回插入的主键id，否则返回null
        const mysqlClient = this.app.mysql.get('db1');
        const ctx=this.ctx;
        const userName=ctx.session.userinfo.loginName;
        const result = await mysqlClient.insert('utvgo_tv_index_record',{
            ...obj,
            status:0,
            createTime:mysqlClient.literals.now,
            updateTime:mysqlClient.literals.now,
            auditeTime:'',
            createBy:userName,
            editeBy:userName,
            auditBy:'',
        });  
        const insertSuccess = result.affectedRows === 1;
     	if(insertSuccess){
     		return result.insertId;
     	}else{
	     	return null;
     	}
    }
    async updatePageRecord(pkId,obj){ //更新成功返回成功记录数，否则返回null
        const mysqlClient = this.app.mysql.get('db1'); 
        const ctx=this.ctx;
        const userName=ctx.session.userinfo.loginName;
    	const row = {
            ...obj,
            editeBy:userName,
    	};
    	const options = {
    		where:{
    			pkId:pkId
    		}
    	};

    	const result = await mysqlClient.update('utvgo_tv_index_record',row,options);
    	//console.log(result);
     	const updateSuccess = result.affectedRows >= 1;
     	if(updateSuccess){
     		return result.affectedRows;
     	}else{
	     	return null;
     	}
    }
    async updatePageRecordStatus(pkId,status){ //更新成功返回成功记录数，否则返回null
        const mysqlClient = this.app.mysql.get('db1'); 
        const ctx=this.ctx;
        const userName=ctx.session.userinfo.loginName;
    	const row = {
            status:status,
            auditBy:userName,
    	};
    	const options = {
    		where:{
    			pkId:pkId
    		}
    	};

    	const result = await mysqlClient.update('utvgo_tv_index_record',row,options);
    	//console.log(result);
     	const updateSuccess = result.affectedRows >= 1;
     	if(updateSuccess){
     		return result.affectedRows;
     	}else{
	     	return null;
     	}
    }
    async updatePageRecordStatusByBatch(pkIds,status){ //批量更新状态 pkIds是数组 
        //UPDATE `utvgo_tv_index_record` SET `status` = '3', `auditBy` = 'lcb' WHERE `pkId` in ('108');
        const ctx=this.ctx;
        const userName=ctx.session.userinfo.loginName;
        const mysqlClient = this.app.mysql.get('db1');
        const result = await mysqlClient.query('UPDATE `utvgo_tv_index_record` SET `status` = ?, `auditBy` = ? WHERE `pkId` in (?)',[status,userName,pkIds]);
        return !!result&&!!result.affectedRows ? result.affectedRows : null; //更新成功返回成功记录数，否则返回null
    }


}
module.exports = tvIndexService;